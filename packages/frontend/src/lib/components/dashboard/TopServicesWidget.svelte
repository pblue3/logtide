<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';

  interface ServiceStat {
    name: string;
    count: number;
    percentage: number;
  }

  interface Props {
    services: ServiceStat[];
  }

  let { services }: Props = $props();
</script>

<Card>
  <CardHeader>
    <CardTitle>Top Services by Volume</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="space-y-4">
      {#each services as service, index (`${service.name}-${index}`)}
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {index + 1}
            </div>
            <div>
              <p class="text-sm font-medium">{service.name}</p>
              <p class="text-xs text-muted-foreground">{service.count.toLocaleString()} logs</p>
            </div>
          </div>
          <Badge variant="secondary">{service.percentage.toFixed(2)}%</Badge>
        </div>
        {#if index < services.length - 1}
          <div class="h-px bg-border"></div>
        {/if}
      {/each}
    </div>
  </CardContent>
</Card>
