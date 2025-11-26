import yaml from 'js-yaml';
import { randomUUID } from 'crypto';
import type { SigmaRule, ParsedSigmaRule } from './types.js';

/**
 * Parse and validate Sigma YAML
 */
export class SigmaParser {
  /**
   * Parse YAML string into Sigma rule
   */
  static parseYaml(yamlContent: string): SigmaRule {
    try {
      const parsed = yaml.load(yamlContent) as SigmaRule;

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid YAML: expected object');
      }

      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`YAML parsing failed: ${error.message}`);
      }
      throw new Error('YAML parsing failed: unknown error');
    }
  }

  /**
   * Validate required fields
   */
  static validate(rule: SigmaRule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required: title
    if (!rule.title || typeof rule.title !== 'string') {
      errors.push('Missing or invalid "title" field');
    }

    // Required: logsource
    if (!rule.logsource || typeof rule.logsource !== 'object') {
      errors.push('Missing or invalid "logsource" field');
    }

    // Required: detection
    if (!rule.detection || typeof rule.detection !== 'object') {
      errors.push('Missing or invalid "detection" field');
    } else {
      // Detection must have a condition
      if (!rule.detection.condition) {
        errors.push('Missing "detection.condition" field');
      }
    }

    // Validate level (if present)
    if (rule.level) {
      const validLevels = ['informational', 'low', 'medium', 'high', 'critical'];
      if (!validLevels.includes(rule.level)) {
        errors.push(
          `Invalid "level": ${rule.level}. Must be one of: ${validLevels.join(', ')}`
        );
      }
    }

    // Validate status (if present)
    if (rule.status) {
      const validStatuses = ['experimental', 'test', 'stable', 'deprecated', 'unsupported'];
      if (!validStatuses.includes(rule.status)) {
        errors.push(
          `Invalid "status": ${rule.status}. Must be one of: ${validStatuses.join(', ')}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalize and enrich parsed rule
   */
  static normalize(rule: SigmaRule): ParsedSigmaRule {
    return {
      ...rule,
      id: rule.id || randomUUID(),
      level: rule.level || 'medium',
      status: rule.status || 'stable',
    };
  }

  /**
   * Parse, validate, and normalize Sigma YAML
   */
  static parse(yamlContent: string): {
    rule: ParsedSigmaRule | null;
    errors: string[];
  } {
    try {
      // Step 1: Parse YAML
      const raw = this.parseYaml(yamlContent);

      // Step 2: Validate
      const validation = this.validate(raw);
      if (!validation.valid) {
        return {
          rule: null,
          errors: validation.errors,
        };
      }

      // Step 3: Normalize
      const normalized = this.normalize(raw);

      return {
        rule: normalized,
        errors: [],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          rule: null,
          errors: [error.message],
        };
      }
      return {
        rule: null,
        errors: ['Unknown parsing error'],
      };
    }
  }
}
