<script lang="ts">
    import { type SigmaRule } from "$lib/api/sigma";
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Badge } from "$lib/components/ui/badge";

    interface Props {
        open: boolean;
        rule: SigmaRule | null;
        onOpenChange?: (open: boolean) => void;
    }

    let { open = $bindable(), rule = null, onOpenChange }: Props = $props();

    function getLevelColor(level: string): string {
        switch (level) {
            case "informational":
                return "bg-blue-100 text-blue-800";
            case "low":
                return "bg-green-100 text-green-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "critical":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

<Dialog.Root
    {open}
    onOpenChange={(o) => {
        open = o;
        if (onOpenChange) onOpenChange(o);
    }}
>
    <Dialog.Content class="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
            <Dialog.Title class="flex items-center gap-3">
                {rule?.title}
                {#if rule}
                    <Badge variant="outline" class={getLevelColor(rule.level || 'medium')}>
                        {(rule.level || 'medium').toUpperCase()}
                    </Badge>
                {/if}
            </Dialog.Title>
            <Dialog.Description>
                {rule?.description || "No description provided"}
            </Dialog.Description>
        </Dialog.Header>

        {#if rule}
            <div class="grid gap-6 py-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold text-muted-foreground"
                            >ID:</span
                        >
                        <span class="ml-2 font-mono">{rule.id}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-muted-foreground"
                            >Status:</span
                        >
                        <span class="ml-2 capitalize">{rule.status}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-muted-foreground"
                            >Author:</span
                        >
                        <span class="ml-2">{rule.author || "Unknown"}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-muted-foreground"
                            >Date:</span
                        >
                        <span class="ml-2">{rule.date || "Unknown"}</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="font-semibold leading-none tracking-tight">
                        Log Source
                    </h4>
                    <div
                        class="p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap"
                    >
                        {JSON.stringify(rule.logsource, null, 2)}
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="font-semibold leading-none tracking-tight">
                        Detection Logic
                    </h4>
                    <div
                        class="p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap"
                    >
                        {JSON.stringify(rule.detection, null, 2)}
                    </div>
                </div>

                {#if rule.conversionStatus}
                    <div class="space-y-2">
                        <h4 class="font-semibold leading-none tracking-tight">
                            Conversion Status
                        </h4>
                        <div class="p-3 border rounded-md text-sm">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="font-medium">Status:</span>
                                <span
                                    class="capitalize {rule.conversionStatus ===
                                    'success'
                                        ? 'text-green-600'
                                        : rule.conversionStatus === 'partial'
                                          ? 'text-yellow-600'
                                          : 'text-red-600'}"
                                >
                                    {rule.conversionStatus}
                                </span>
                            </div>
                            {#if rule.conversionNotes}
                                <p class="text-muted-foreground">
                                    {rule.conversionNotes}
                                </p>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}

        <Dialog.Footer>
            <Button variant="outline" onclick={() => (open = false)}
                >Close</Button
            >
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
