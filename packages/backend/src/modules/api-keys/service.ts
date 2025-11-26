import crypto from 'crypto';
import { db } from '../../database/connection.js';

export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  createdAt: Date;
  lastUsed: Date | null;
  revoked: boolean;
}

export interface CreateApiKeyInput {
  projectId: string;
  name: string;
}

export class ApiKeysService {
  /**
   * Hash an API key using SHA-256
   */
  private hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Generate a new API key
   */
  generateApiKey(): string {
    return `lp_${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * Create a new API key for a project
   */
  async createApiKey(input: CreateApiKeyInput): Promise<{ id: string; apiKey: string }> {
    const apiKey = this.generateApiKey();
    const keyHash = this.hashApiKey(apiKey);

    const result = await db
      .insertInto('api_keys')
      .values({
        project_id: input.projectId,
        name: input.name,
        key_hash: keyHash,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    return {
      id: result.id,
      apiKey, // Return plain key only once
    };
  }

  /**
   * Verify an API key and return project ID
   */
  async verifyApiKey(apiKey: string): Promise<{ projectId: string; organizationId: string } | null> {
    const keyHash = this.hashApiKey(apiKey);

    const result = await db
      .selectFrom('api_keys')
      .innerJoin('projects', 'api_keys.project_id', 'projects.id')
      .select(['api_keys.id', 'api_keys.project_id', 'projects.organization_id'])
      .where('api_keys.key_hash', '=', keyHash)
      .where('api_keys.revoked', '=', false)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    // Update last_used timestamp
    await db
      .updateTable('api_keys')
      .set({ last_used: new Date() })
      .where('id', '=', result.id)
      .execute();

    return {
      projectId: result.project_id,
      organizationId: result.organization_id,
    };
  }

  /**
   * List all API keys for a project
   */
  async listProjectApiKeys(projectId: string): Promise<ApiKey[]> {
    const keys = await db
      .selectFrom('api_keys')
      .select(['id', 'project_id', 'name', 'created_at', 'last_used', 'revoked'])
      .where('project_id', '=', projectId)
      .orderBy('created_at', 'desc')
      .execute();

    return keys.map((k) => ({
      id: k.id,
      projectId: k.project_id,
      name: k.name,
      createdAt: new Date(k.created_at),
      lastUsed: k.last_used ? new Date(k.last_used) : null,
      revoked: k.revoked,
    }));
  }

  /**
   * Revoke (soft delete) an API key
   */
  async revokeApiKey(id: string, projectId: string): Promise<boolean> {
    const result = await db
      .updateTable('api_keys')
      .set({ revoked: true })
      .where('id', '=', id)
      .where('project_id', '=', projectId)
      .executeTakeFirst();

    return Number(result.numUpdatedRows || 0) > 0;
  }

  /**
   * Delete an API key permanently
   */
  async deleteApiKey(id: string, projectId: string): Promise<boolean> {
    const result = await db
      .deleteFrom('api_keys')
      .where('id', '=', id)
      .where('project_id', '=', projectId)
      .executeTakeFirst();

    return Number(result.numDeletedRows || 0) > 0;
  }
}

export const apiKeysService = new ApiKeysService();
