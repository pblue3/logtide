/**
 * MITRE ATT&CK Mapper
 *
 * Maps Sigma tags to MITRE ATT&CK techniques and tactics
 * Based on https://attack.mitre.org/
 */

export interface MITRETechnique {
  id: string; // e.g., "T1059"
  name: string; // e.g., "Command and Scripting Interpreter"
  tactic: string; // e.g., "execution"
  subtechnique?: string; // e.g., "T1059.001" → "PowerShell"
}

export interface MITRETactic {
  id: string; // e.g., "TA0002"
  name: string; // e.g., "execution"
  description: string;
}

/**
 * MITRE ATT&CK Tactics mapping
 * Based on https://attack.mitre.org/tactics/enterprise/
 */
const MITRE_TACTICS: Record<string, MITRETactic> = {
  'reconnaissance': {
    id: 'TA0043',
    name: 'reconnaissance',
    description: 'Gather information for planning future operations',
  },
  'resource-development': {
    id: 'TA0042',
    name: 'resource-development',
    description: 'Establish resources to support operations',
  },
  'initial-access': {
    id: 'TA0001',
    name: 'initial-access',
    description: 'Gain initial foothold within a network',
  },
  'execution': {
    id: 'TA0002',
    name: 'execution',
    description: 'Run malicious code',
  },
  'persistence': {
    id: 'TA0003',
    name: 'persistence',
    description: 'Maintain access across restarts',
  },
  'privilege-escalation': {
    id: 'TA0004',
    name: 'privilege-escalation',
    description: 'Gain higher-level permissions',
  },
  'defense-evasion': {
    id: 'TA0005',
    name: 'defense-evasion',
    description: 'Avoid detection',
  },
  'credential-access': {
    id: 'TA0006',
    name: 'credential-access',
    description: 'Steal credentials',
  },
  'discovery': {
    id: 'TA0007',
    name: 'discovery',
    description: 'Explore the environment',
  },
  'lateral-movement': {
    id: 'TA0008',
    name: 'lateral-movement',
    description: 'Move through the environment',
  },
  'collection': {
    id: 'TA0009',
    name: 'collection',
    description: 'Gather data of interest',
  },
  'command-and-control': {
    id: 'TA0011',
    name: 'command-and-control',
    description: 'Communicate with compromised systems',
  },
  'exfiltration': {
    id: 'TA0010',
    name: 'exfiltration',
    description: 'Steal data from the network',
  },
  'impact': {
    id: 'TA0040',
    name: 'impact',
    description: 'Manipulate, interrupt, or destroy systems/data',
  },
};

/**
 * Common MITRE techniques found in Sigma rules
 * This is a subset - full mapping would include 600+ techniques
 */
const MITRE_TECHNIQUES: Record<string, Omit<MITRETechnique, 'id'>> = {
  // Execution
  'T1059': { name: 'Command and Scripting Interpreter', tactic: 'execution' },
  'T1059.001': { name: 'PowerShell', tactic: 'execution', subtechnique: 'T1059.001' },
  'T1059.003': { name: 'Windows Command Shell', tactic: 'execution', subtechnique: 'T1059.003' },
  'T1059.005': { name: 'Visual Basic', tactic: 'execution', subtechnique: 'T1059.005' },
  'T1059.006': { name: 'Python', tactic: 'execution', subtechnique: 'T1059.006' },
  'T1059.007': { name: 'JavaScript', tactic: 'execution', subtechnique: 'T1059.007' },
  'T1047': { name: 'Windows Management Instrumentation', tactic: 'execution' },
  'T1053': { name: 'Scheduled Task/Job', tactic: 'execution' },
  'T1053.005': { name: 'Scheduled Task', tactic: 'execution', subtechnique: 'T1053.005' },
  'T1204': { name: 'User Execution', tactic: 'execution' },
  'T1204.002': { name: 'Malicious File', tactic: 'execution', subtechnique: 'T1204.002' },

  // Persistence
  'T1547': { name: 'Boot or Logon Autostart Execution', tactic: 'persistence' },
  'T1547.001': { name: 'Registry Run Keys / Startup Folder', tactic: 'persistence', subtechnique: 'T1547.001' },
  'T1543': { name: 'Create or Modify System Process', tactic: 'persistence' },
  'T1543.003': { name: 'Windows Service', tactic: 'persistence', subtechnique: 'T1543.003' },
  'T1574': { name: 'Hijack Execution Flow', tactic: 'persistence' },
  'T1574.001': { name: 'DLL Search Order Hijacking', tactic: 'persistence', subtechnique: 'T1574.001' },

  // Privilege Escalation
  'T1134': { name: 'Access Token Manipulation', tactic: 'privilege-escalation' },
  'T1134.001': { name: 'Token Impersonation/Theft', tactic: 'privilege-escalation', subtechnique: 'T1134.001' },
  'T1068': { name: 'Exploitation for Privilege Escalation', tactic: 'privilege-escalation' },
  'T1548': { name: 'Abuse Elevation Control Mechanism', tactic: 'privilege-escalation' },
  'T1548.002': { name: 'Bypass User Account Control', tactic: 'privilege-escalation', subtechnique: 'T1548.002' },

  // Defense Evasion
  'T1027': { name: 'Obfuscated Files or Information', tactic: 'defense-evasion' },
  'T1027.010': { name: 'Command Obfuscation', tactic: 'defense-evasion', subtechnique: 'T1027.010' },
  'T1070': { name: 'Indicator Removal', tactic: 'defense-evasion' },
  'T1070.001': { name: 'Clear Windows Event Logs', tactic: 'defense-evasion', subtechnique: 'T1070.001' },
  'T1112': { name: 'Modify Registry', tactic: 'defense-evasion' },
  'T1218': { name: 'System Binary Proxy Execution', tactic: 'defense-evasion' },
  'T1218.011': { name: 'Rundll32', tactic: 'defense-evasion', subtechnique: 'T1218.011' },
  'T1055': { name: 'Process Injection', tactic: 'defense-evasion' },
  'T1562': { name: 'Impair Defenses', tactic: 'defense-evasion' },
  'T1562.001': { name: 'Disable or Modify Tools', tactic: 'defense-evasion', subtechnique: 'T1562.001' },

  // Credential Access
  'T1003': { name: 'OS Credential Dumping', tactic: 'credential-access' },
  'T1003.001': { name: 'LSASS Memory', tactic: 'credential-access', subtechnique: 'T1003.001' },
  'T1003.002': { name: 'Security Account Manager', tactic: 'credential-access', subtechnique: 'T1003.002' },
  'T1003.003': { name: 'NTDS', tactic: 'credential-access', subtechnique: 'T1003.003' },
  'T1110': { name: 'Brute Force', tactic: 'credential-access' },
  'T1552': { name: 'Unsecured Credentials', tactic: 'credential-access' },
  'T1555': { name: 'Credentials from Password Stores', tactic: 'credential-access' },

  // Discovery
  'T1007': { name: 'System Service Discovery', tactic: 'discovery' },
  'T1018': { name: 'Remote System Discovery', tactic: 'discovery' },
  'T1033': { name: 'System Owner/User Discovery', tactic: 'discovery' },
  'T1049': { name: 'System Network Connections Discovery', tactic: 'discovery' },
  'T1069': { name: 'Permission Groups Discovery', tactic: 'discovery' },
  'T1069.001': { name: 'Local Groups', tactic: 'discovery', subtechnique: 'T1069.001' },
  'T1069.002': { name: 'Domain Groups', tactic: 'discovery', subtechnique: 'T1069.002' },
  'T1082': { name: 'System Information Discovery', tactic: 'discovery' },
  'T1083': { name: 'File and Directory Discovery', tactic: 'discovery' },

  // Lateral Movement
  'T1021': { name: 'Remote Services', tactic: 'lateral-movement' },
  'T1021.001': { name: 'Remote Desktop Protocol', tactic: 'lateral-movement', subtechnique: 'T1021.001' },
  'T1021.002': { name: 'SMB/Windows Admin Shares', tactic: 'lateral-movement', subtechnique: 'T1021.002' },
  'T1021.006': { name: 'Windows Remote Management', tactic: 'lateral-movement', subtechnique: 'T1021.006' },
  'T1570': { name: 'Lateral Tool Transfer', tactic: 'lateral-movement' },

  // Collection
  'T1005': { name: 'Data from Local System', tactic: 'collection' },
  'T1039': { name: 'Data from Network Shared Drive', tactic: 'collection' },
  'T1056': { name: 'Input Capture', tactic: 'collection' },
  'T1056.001': { name: 'Keylogging', tactic: 'collection', subtechnique: 'T1056.001' },
  'T1074': { name: 'Data Staged', tactic: 'collection' },
  'T1114': { name: 'Email Collection', tactic: 'collection' },

  // Exfiltration
  'T1020': { name: 'Automated Exfiltration', tactic: 'exfiltration' },
  'T1041': { name: 'Exfiltration Over C2 Channel', tactic: 'exfiltration' },
  'T1048': { name: 'Exfiltration Over Alternative Protocol', tactic: 'exfiltration' },
  'T1567': { name: 'Exfiltration Over Web Service', tactic: 'exfiltration' },

  // Impact
  'T1485': { name: 'Data Destruction', tactic: 'impact' },
  'T1486': { name: 'Data Encrypted for Impact', tactic: 'impact' },
  'T1490': { name: 'Inhibit System Recovery', tactic: 'impact' },
  'T1491': { name: 'Defacement', tactic: 'impact' },
  'T1498': { name: 'Network Denial of Service', tactic: 'impact' },
  'T1499': { name: 'Endpoint Denial of Service', tactic: 'impact' },
};

export class MITREMapper {
  /**
   * Extract MITRE techniques from Sigma tags
   *
   * Sigma tags follow patterns like:
   * - attack.t1059 (technique)
   * - attack.t1059.001 (sub-technique)
   * - attack.execution (tactic)
   */
  static extractTechniques(tags: string[]): string[] {
    if (!tags || tags.length === 0) {
      return [];
    }

    const techniques: string[] = [];

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();

      // Match "attack.t1234" or "attack.t1234.001"
      const techMatch = lowerTag.match(/attack\.t(\d{4})(?:\.(\d{3}))?/);

      if (techMatch) {
        const techId = techMatch[2]
          ? `T${techMatch[1]}.${techMatch[2]}`
          : `T${techMatch[1]}`;

        techniques.push(techId.toUpperCase());
      }
    }

    // Remove duplicates
    return Array.from(new Set(techniques));
  }

  /**
   * Extract MITRE tactics from Sigma tags
   */
  static extractTactics(tags: string[]): string[] {
    if (!tags || tags.length === 0) {
      return [];
    }

    const tactics: string[] = [];

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();

      // Match "attack.{tactic}"
      const tacticMatch = lowerTag.match(/^attack\.([a-z-]+)$/);

      if (tacticMatch) {
        const tacticName = tacticMatch[1];

        // Check if it's a valid tactic
        if (MITRE_TACTICS[tacticName]) {
          tactics.push(tacticName);
        }
      }
    }

    // Also extract tactics from techniques
    const techniques = this.extractTechniques(tags);

    for (const techId of techniques) {
      const technique = MITRE_TECHNIQUES[techId];
      if (technique && !tactics.includes(technique.tactic)) {
        tactics.push(technique.tactic);
      }
    }

    // Remove duplicates
    return Array.from(new Set(tactics));
  }

  /**
   * Get technique details
   */
  static getTechniqueInfo(techniqueId: string): MITRETechnique | null {
    const technique = MITRE_TECHNIQUES[techniqueId];

    if (!technique) {
      return null;
    }

    return {
      id: techniqueId,
      ...technique,
    };
  }

  /**
   * Get tactic details
   */
  static getTacticInfo(tacticName: string): MITRETactic | null {
    return MITRE_TACTICS[tacticName] || null;
  }

  /**
   * Get all tactics
   */
  static getAllTactics(): MITRETactic[] {
    return Object.values(MITRE_TACTICS);
  }

  /**
   * Get techniques by tactic
   */
  static getTechniquesByTactic(tacticName: string): MITRETechnique[] {
    return Object.entries(MITRE_TECHNIQUES)
      .filter(([_, tech]) => tech.tactic === tacticName)
      .map(([id, tech]) => ({ id, ...tech }));
  }

  /**
   * Parse all MITRE info from Sigma tags
   */
  static parseFromTags(tags: string[]): {
    techniques: string[];
    tactics: string[];
  } {
    return {
      techniques: this.extractTechniques(tags),
      tactics: this.extractTactics(tags),
    };
  }
}
