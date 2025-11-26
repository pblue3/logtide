import { db } from '../../database/connection.js';
import type { Organization, OrganizationMember, OrganizationWithRole } from '@logward/shared';

export interface CreateOrganizationInput {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  description?: string;
}

export class OrganizationsService {
  /**
   * Generate a slug from a name
   */
  private generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 255);
  }

  /**
   * Find a unique slug by appending a number if needed
   */
  private async findUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db
        .selectFrom('organizations')
        .select('id')
        .where('slug', '=', slug)
        .executeTakeFirst();

      if (!existing) {
        return slug;
      }

      // Append counter to make it unique
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Create a new organization
   */
  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    // Generate slug from name
    const baseSlug = this.generateSlugFromName(input.name);

    // Find unique slug
    const uniqueSlug = await this.findUniqueSlug(baseSlug);

    // Create organization
    const org = await db
      .insertInto('organizations')
      .values({
        name: input.name,
        slug: uniqueSlug,
        description: input.description || null,
        owner_id: input.userId,
      })
      .returning(['id', 'name', 'slug', 'description', 'owner_id', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    // Add user as owner member
    await db
      .insertInto('organization_members')
      .values({
        organization_id: org.id,
        user_id: input.userId,
        role: 'owner',
      })
      .execute();

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description || undefined,
      ownerId: org.owner_id,
      createdAt: new Date(org.created_at),
      updatedAt: new Date(org.updated_at),
    };
  }

  /**
   * Get all organizations for a user (with their role)
   */
  async getUserOrganizations(userId: string): Promise<OrganizationWithRole[]> {
    const organizations = await db
      .selectFrom('organizations')
      .innerJoin('organization_members', 'organizations.id', 'organization_members.organization_id')
      .select([
        'organizations.id',
        'organizations.name',
        'organizations.slug',
        'organizations.description',
        'organizations.owner_id',
        'organizations.created_at',
        'organizations.updated_at',
        'organization_members.role',
      ])
      .where('organization_members.user_id', '=', userId)
      .orderBy('organizations.created_at', 'desc')
      .execute();

    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description || undefined,
      ownerId: org.owner_id,
      createdAt: new Date(org.created_at),
      updatedAt: new Date(org.updated_at),
      role: org.role as 'owner' | 'member',
    }));
  }

  /**
   * Get an organization by ID
   */
  async getOrganizationById(
    organizationId: string,
    userId: string
  ): Promise<OrganizationWithRole | null> {
    const org = await db
      .selectFrom('organizations')
      .innerJoin('organization_members', 'organizations.id', 'organization_members.organization_id')
      .select([
        'organizations.id',
        'organizations.name',
        'organizations.slug',
        'organizations.description',
        'organizations.owner_id',
        'organizations.created_at',
        'organizations.updated_at',
        'organization_members.role',
      ])
      .where('organizations.id', '=', organizationId)
      .where('organization_members.user_id', '=', userId)
      .executeTakeFirst();

    if (!org) {
      return null;
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description || undefined,
      ownerId: org.owner_id,
      createdAt: new Date(org.created_at),
      updatedAt: new Date(org.updated_at),
      role: org.role as 'owner' | 'member',
    };
  }

  /**
   * Get an organization by slug
   */
  async getOrganizationBySlug(
    slug: string,
    userId: string
  ): Promise<OrganizationWithRole | null> {
    const org = await db
      .selectFrom('organizations')
      .innerJoin('organization_members', 'organizations.id', 'organization_members.organization_id')
      .select([
        'organizations.id',
        'organizations.name',
        'organizations.slug',
        'organizations.description',
        'organizations.owner_id',
        'organizations.created_at',
        'organizations.updated_at',
        'organization_members.role',
      ])
      .where('organizations.slug', '=', slug)
      .where('organization_members.user_id', '=', userId)
      .executeTakeFirst();

    if (!org) {
      return null;
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description || undefined,
      ownerId: org.owner_id,
      createdAt: new Date(org.created_at),
      updatedAt: new Date(org.updated_at),
      role: org.role as 'owner' | 'member',
    };
  }

  /**
   * Update an organization (owner only)
   */
  async updateOrganization(
    organizationId: string,
    userId: string,
    input: UpdateOrganizationInput
  ): Promise<Organization> {
    // Check if user is owner
    const org = await db
      .selectFrom('organizations')
      .select('owner_id')
      .where('id', '=', organizationId)
      .executeTakeFirst();

    if (!org) {
      throw new Error('Organization not found');
    }

    if (org.owner_id !== userId) {
      throw new Error('Only the organization owner can update it');
    }

    // If changing name, regenerate slug
    let newSlug: string | undefined;
    if (input.name) {
      const baseSlug = this.generateSlugFromName(input.name);
      newSlug = await this.findUniqueSlug(baseSlug);
    }

    const updated = await db
      .updateTable('organizations')
      .set({
        ...(input.name && { name: input.name }),
        ...(newSlug && { slug: newSlug }),
        ...(input.description !== undefined && { description: input.description || null }),
        updated_at: new Date(),
      })
      .where('id', '=', organizationId)
      .returning(['id', 'name', 'slug', 'description', 'owner_id', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description || undefined,
      ownerId: updated.owner_id,
      createdAt: new Date(updated.created_at),
      updatedAt: new Date(updated.updated_at),
    };
  }

  /**
   * Delete an organization (owner only)
   */
  async deleteOrganization(organizationId: string, userId: string): Promise<void> {
    // Check if user is owner
    const org = await db
      .selectFrom('organizations')
      .select('owner_id')
      .where('id', '=', organizationId)
      .executeTakeFirst();

    if (!org) {
      throw new Error('Organization not found');
    }

    if (org.owner_id !== userId) {
      throw new Error('Only the organization owner can delete it');
    }

    // Delete organization (cascade will handle members and projects)
    await db.deleteFrom('organizations').where('id', '=', organizationId).execute();
  }

  /**
   * Get organization members
   */
  async getOrganizationMembers(
    organizationId: string,
    userId: string
  ): Promise<OrganizationMember[]> {
    // Check if user has access to this organization
    const hasAccess = await db
      .selectFrom('organization_members')
      .select('id')
      .where('organization_id', '=', organizationId)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    if (!hasAccess) {
      throw new Error('You do not have access to this organization');
    }

    const members = await db
      .selectFrom('organization_members')
      .select(['id', 'organization_id', 'user_id', 'role', 'created_at'])
      .where('organization_id', '=', organizationId)
      .execute();

    return members.map((m) => ({
      id: m.id,
      organizationId: m.organization_id,
      userId: m.user_id,
      role: m.role as 'owner' | 'member',
      createdAt: new Date(m.created_at),
    }));
  }
}
