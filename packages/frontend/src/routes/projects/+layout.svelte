<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import RequireOrganization from '$lib/components/RequireOrganization.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppLayout>
	<RequireOrganization>
		{@render children()}
	</RequireOrganization>
</AppLayout>
