import { SigmaDetectionEngine, type LogEntry } from '../../modules/sigma/detection-engine.js';
import { db } from '../../database/connection.js';
import { createQueue } from '../connection.js';

export interface SigmaDetectionData {
  logs: LogEntry[];
  organizationId: string;
  projectId?: string;
}

export interface SigmaDetectionMatch {
  logIndex: number;
  sigmaRuleId: string;
  ruleTitle: string;
  ruleLevel: string;
  matchedAt: Date;
}

/**
 * Process Sigma detection job
 * Evaluates a batch of logs against active Sigma rules
 */
export async function processSigmaDetection(job: any) {
  const data: SigmaDetectionData = job.data;

  console.log(
    `[SigmaDetection] Processing ${data.logs.length} logs for org ${data.organizationId}`
  );

  try {
    // Evaluate logs against Sigma rules
    const results = await SigmaDetectionEngine.evaluateBatch(
      data.logs,
      data.organizationId,
      data.projectId
    );

    // Collect all matches
    const allMatches: SigmaDetectionMatch[] = [];

    results.forEach((result, logIndex) => {
      if (result.matched) {
        result.matchedRules.forEach((matchedRule) => {
          allMatches.push({
            logIndex,
            sigmaRuleId: matchedRule.sigmaRuleId,
            ruleTitle: matchedRule.ruleTitle,
            ruleLevel: matchedRule.ruleLevel,
            matchedAt: matchedRule.matchedAt,
          });
        });
      }
    });

    if (allMatches.length === 0) {
      console.log(`[SigmaDetection] No matches found`);
      return;
    }

    console.log(
      `[SigmaDetection] Found ${allMatches.length} matches across ${data.logs.length} logs`
    );

    // Group matches by Sigma rule
    const matchesByRule = new Map<string, SigmaDetectionMatch[]>();

    allMatches.forEach((match) => {
      const existing = matchesByRule.get(match.sigmaRuleId) || [];
      existing.push(match);
      matchesByRule.set(match.sigmaRuleId, existing);
    });

    // Save detection history and trigger notifications
    for (const [sigmaRuleId, matches] of matchesByRule.entries()) {
      const firstMatch = matches[0];

      try {
        // Find the Sigma rule in database
        const sigmaRule = await db
          .selectFrom('sigma_rules')
          .select(['id', 'title', 'level', 'email_recipients', 'webhook_url'])
          .where('sigma_id', '=', sigmaRuleId)
          .where('organization_id', '=', data.organizationId)
          .executeTakeFirst();

        if (!sigmaRule) {
          console.warn(`[SigmaDetection] Sigma rule not found: ${sigmaRuleId}`);
          continue;
        }

        // Log detection for monitoring
        console.log(
          `[SigmaDetection] Sigma rule matched: ${firstMatch.ruleTitle} (${matches.length} matches, level: ${firstMatch.ruleLevel})`
        );

        // Check if notifications are configured
        const hasEmail = sigmaRule.email_recipients && sigmaRule.email_recipients.length > 0;
        const hasWebhook = !!sigmaRule.webhook_url;

        if (!hasEmail && !hasWebhook) {
          console.log(
            `[SigmaDetection] Sigma rule "${firstMatch.ruleTitle}" matched but has no notification settings (detection-only mode)`
          );
          continue;
        }

        // Queue notification job directly (no alert rule needed)
        const notificationQueue = createQueue('alert-notifications');

        await notificationQueue.add('send-notification', {
          historyId: null, // No alert history for Sigma rules
          rule_id: sigmaRule.id,
          rule_name: `[Sigma] ${firstMatch.ruleTitle}`,
          log_count: matches.length,
          threshold: 1, // Sigma rules are match-based, not threshold-based
          time_window: 1, // Immediate detection
          email_recipients: sigmaRule.email_recipients || [],
          webhook_url: sigmaRule.webhook_url,
        });

        console.log(
          `[SigmaDetection] Queued notification for: ${firstMatch.ruleTitle}`
        );
      } catch (error) {
        console.error(
          `[SigmaDetection] Error saving detection for rule ${sigmaRuleId}:`,
          error
        );
      }
    }

    console.log(`[SigmaDetection] Job completed successfully`);
  } catch (error) {
    console.error(`[SigmaDetection] Job failed:`, error);
    throw error;
  }
}
