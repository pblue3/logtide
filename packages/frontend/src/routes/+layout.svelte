<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";
</script>

<ProgressBar class="text-primary" zIndex={100} />
<Toaster />
<slot />
