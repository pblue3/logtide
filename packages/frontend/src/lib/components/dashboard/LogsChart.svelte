<script lang="ts">
  import { onMount } from 'svelte';
  import * as echarts from 'echarts';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  interface Props {
    data: {
      time: string;
      total: number;
      error: number;
      warn: number;
      info: number;
    }[];
  }

  let { data }: Props = $props();
  let chartContainer: HTMLDivElement;
  let chart: echarts.ECharts | null = null;

  onMount(() => {
    chart = echarts.init(chartContainer);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Total', 'Errors', 'Warnings', 'Info'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => new Date(d.time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }))
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total',
          type: 'line',
          smooth: true,
          data: data.map(d => d.total),
          lineStyle: { color: '#3b82f6' },
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Errors',
          type: 'line',
          smooth: true,
          data: data.map(d => d.error),
          lineStyle: { color: '#ef4444' },
          itemStyle: { color: '#ef4444' }
        },
        {
          name: 'Warnings',
          type: 'line',
          smooth: true,
          data: data.map(d => d.warn),
          lineStyle: { color: '#f59e0b' },
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'Info',
          type: 'line',
          smooth: true,
          data: data.map(d => d.info),
          lineStyle: { color: '#10b981' },
          itemStyle: { color: '#10b981' }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
    };
  });

  $effect(() => {
    if (chart && data) {
      const option: echarts.EChartsOption = {
        xAxis: {
          data: data.map(d => new Date(d.time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }))
        },
        series: [
          { data: data.map(d => d.total) },
          { data: data.map(d => d.error) },
          { data: data.map(d => d.warn) },
          { data: data.map(d => d.info) }
        ]
      };
      chart.setOption(option);
    }
  });
</script>

<Card>
  <CardHeader>
    <CardTitle>Logs Timeline (Last 24 Hours)</CardTitle>
  </CardHeader>
  <CardContent>
    <div bind:this={chartContainer} class="h-[300px] w-full"></div>
  </CardContent>
</Card>
