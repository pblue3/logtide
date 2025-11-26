<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';

  let loading = true;

  onMount(() => {
    authStore.subscribe((state) => {
      if (state.token) {
        goto('/dashboard');
      } else {
        goto('/login');
      }
      loading = false;
    });
  });
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-muted-foreground">Loading...</p>
  </div>
{/if}
