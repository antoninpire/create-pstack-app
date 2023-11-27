<script lang="ts">
  import { trpc } from "$lib/trpc";

  const query = trpc.example.query({ message: "Hello World!" });
</script>

{#if $query.isLoading}
  loading...
{:else}
  <b>Message received through CSR</b>: {$query.data?.message}
{/if}
