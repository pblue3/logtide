<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { organizationStore } from '$lib/stores/organization';
  import { toastStore } from '$lib/stores/toast';
  import { OrganizationsAPI } from '$lib/api/organizations';
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Footer from '$lib/components/Footer.svelte';

  let isLoading = $state(false);
  let orgName = $state('');
  let orgSlug = $state('');
  let orgDescription = $state('');
  let token = $state<string | null>(null);
  let organizationsAPI = $derived(new OrganizationsAPI(() => token));

  let isFormValid = $derived(orgName.trim().length > 0);

  authStore.subscribe((state) => {
    token = state.token;
  });

  onMount(() => {
    if (!$authStore.user) {
      goto('/login');
    }
  });

  $effect(() => {
    if (orgName) {
      orgSlug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    } else {
      orgSlug = '';
    }
  });

  async function createOrganization() {
    if (!orgName.trim()) {
      toastStore.error('Organization name is required');
      return;
    }

    isLoading = true;

    try {
      const newOrg = await organizationStore.createOrganization(async () => {
        const response = await organizationsAPI.createOrganization({
          name: orgName.trim(),
          description: orgDescription.trim() || undefined,
        });
        return response.organization;
      });

      console.log('Organization created:', newOrg);
      toastStore.success('Organization created successfully!');

      console.log('Current organization already set to:', newOrg.id);

      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Redirecting to /dashboard...');
      await goto('/dashboard');
      console.log('Redirected successfully');
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      toastStore.error(error.message || 'Failed to create organization');
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Organization - LogWard</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col">
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Building2 class="w-6 h-6" />
          </div>
          <h1 class="text-4xl font-bold">LogWard</h1>
        </div>
        <div class="flex items-center justify-center gap-2 mb-2">
          <Sparkles class="w-5 h-5 text-primary" />
          <h2 class="text-2xl font-semibold">Welcome aboard!</h2>
        </div>
        <p class="text-muted-foreground">
          Let's create your first organization to get started
        </p>
      </div>

      <Card class="mb-6 border-primary/20 bg-primary/5">
        <CardContent class="pt-6">
          <div class="space-y-2 text-sm">
            <p><strong>What is an Organization?</strong></p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Organizations help you separate logs by team, environment, or client</li>
              <li>Each organization has its own projects, logs, and alert rules</li>
              <li>You can create multiple organizations and switch between them anytime</li>
              <li>Team members can be invited to collaborate within an organization</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Organization</CardTitle>
          <CardDescription>
            This will be your workspace for managing logs and projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onsubmit={(e) => { e.preventDefault(); createOrganization(); }} class="space-y-6">
            <div class="space-y-2">
              <Label for="org-name">
                Organization Name <span class="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                type="text"
                placeholder="e.g., Acme Corp, My Startup, Production Environment"
                bind:value={orgName}
                disabled={isLoading}
                required
                autofocus
              />
              <p class="text-xs text-muted-foreground">
                A friendly name for your organization
              </p>
            </div>

            {#if orgSlug}
              <div class="space-y-2">
                <Label for="org-slug-preview">Organization Slug (auto-generated)</Label>
                <div class="px-3 py-2 bg-muted rounded-md text-sm font-mono text-muted-foreground">
                  {orgSlug}
                </div>
                <p class="text-xs text-muted-foreground">
                  This unique identifier will be automatically generated from your organization name
                </p>
              </div>
            {/if}

            <div class="space-y-2">
              <Label for="org-description">Description (optional)</Label>
              <Textarea
                id="org-description"
                placeholder="Briefly describe this organization..."
                bind:value={orgDescription}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div class="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                class="flex-1"
              >
                {#if isLoading}
                  Creating...
                {:else}
                  Create Organization & Continue
                {/if}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onclick={() => {
                  authStore.clearAuth();
                  goto('/login');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-sm text-muted-foreground mt-6">
        Need help? Check out our <a href="/docs" class="text-primary hover:underline">documentation</a>
        or contact support
      </p>
    </div>
  </div>

  <Footer />
</div>
