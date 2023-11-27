<script>
  import { trpc } from "$lib/trpc";
  import { QueryClientProvider } from "@tanstack/svelte-query";

  import "../app.postcss";

  export let data;

  $: queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
