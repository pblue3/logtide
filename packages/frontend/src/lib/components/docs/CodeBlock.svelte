<script lang="ts">
    import { onMount } from "svelte";
    import { Check, Copy } from "lucide-svelte";
    import { codeToHtml } from "shiki";

    export let code: string;
    export let lang: string = "typescript";

    let highlightedCode = "";
    let copied = false;

    onMount(async () => {
        try {
            highlightedCode = await codeToHtml(code, {
                lang,
                theme: "vitesse-dark",
            });
        } catch (error) {
            console.error("Shiki highlighting error:", error);
            // Fallback to plain code if highlighting fails
            highlightedCode = `<pre class="p-4 bg-background"><code>${escapeHtml(code)}</code></pre>`;
        }
    });

    function escapeHtml(text: string): string {
        const map: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    async function copyCode() {
        await navigator.clipboard.writeText(code);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 2000);
    }
</script>

<div class="code-block-wrapper relative group">
    <div
        class="flex items-center justify-between px-4 py-2 bg-muted border-b border-border"
    >
        <span class="text-xs font-mono text-muted-foreground uppercase"
            >{lang}</span
        >
        <button
            on:click={copyCode}
            class="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors hover:bg-background border border-transparent hover:border-border"
            title="Copy code"
        >
            {#if copied}
                <Check class="w-3.5 h-3.5 text-green-500" />
                <span class="text-green-500">Copied!</span>
            {:else}
                <Copy class="w-3.5 h-3.5" />
                <span>Copy</span>
            {/if}
        </button>
    </div>

    <div class="code-content overflow-x-auto">
        {#if highlightedCode}
            {@html highlightedCode}
        {:else}
            <pre class="p-4 bg-background"><code>{code}</code></pre>
        {/if}
    </div>
</div>

<style>
    .code-block-wrapper {
        border-radius: 0.5rem;
        border: 1px solid hsl(var(--border));
        overflow: hidden;
        background-color: hsl(var(--card));
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .code-content :global(pre) {
        padding: 1rem;
        margin: 0;
        background-color: hsl(var(--background));
        font-size: 0.875rem;
        line-height: 1.7;
    }

    .code-content :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
    }
</style>
