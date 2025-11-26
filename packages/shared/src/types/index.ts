import type { LogLevel } from '../schemas/index.js';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'member';
  createdAt: Date;
}

export interface OrganizationWithRole extends Organization {
  role: 'owner' | 'member';
  memberCount?: number;
}

// Project types
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Log types
export interface Log {
  time: Date;
  service: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  trace_id?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_hash: string;
  created_at: Date;
  last_used?: Date;
  revoked: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  service?: string;
  level: LogLevel[];
  threshold: number;
  time_window: number;
  email_recipients: string[];
  webhook_url?: string;
  created_at: Date;
  updated_at: Date;
}
