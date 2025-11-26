<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

  interface LogError {
    time: string;
    service: string;
    level: 'error' | 'critical';
    message: string;
  }

  interface Props {
    errors: LogError[];
  }

  let { errors }: Props = $props();

  function formatTime(time: string): string {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Recent Errors</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="space-y-3">
      {#each errors as error, index (`${error.time}-${error.service}-${index}`)}
        <div class="flex gap-3 rounded-lg border p-3">
          <div class="flex-shrink-0">
            {#if error.level === 'critical'}
              <AlertCircle class="h-5 w-5 text-red-600" />
            {:else}
              <AlertTriangle class="h-5 w-5 text-orange-600" />
            {/if}
          </div>
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">{error.service}</p>
              <p class="text-xs text-muted-foreground">{formatTime(error.time)}</p>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-2">{error.message}</p>
            <Badge variant={error.level === 'critical' ? 'destructive' : 'secondary'} class="text-xs">
              {error.level}
            </Badge>
          </div>
        </div>
      {/each}
    </div>
  </CardContent>
</Card>
