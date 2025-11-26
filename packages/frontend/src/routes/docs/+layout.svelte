<script lang="ts">
    import DocsSidebar from "$lib/components/docs/DocsSidebar.svelte";
    import DocsTableOfContents from "$lib/components/docs/DocsTableOfContents.svelte";
    import Navbar from "$lib/components/ui/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<Navbar />

<div class="docs-layout min-h-screen bg-background flex flex-col">
    <div class="flex flex-1">
        <DocsSidebar />

        <main class="docs-main flex-1">
            <div class="docs-content-wrapper max-w-4xl mx-auto p-8">
                <slot />
            </div>
        </main>

        <DocsTableOfContents />
    </div>

    <Footer />
</div>

<style>
    .docs-layout {
        display: flex;
        min-height: 100vh;
        margin-top: 64px;
    }

    .docs-main {
        flex: 1;
        min-width: 0;
    }

    @media (max-width: 1024px) {
        .docs-layout {
            display: block;
        }
    }
</style>
