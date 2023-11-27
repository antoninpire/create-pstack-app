<script lang="ts">
  import { trpc } from "$lib/trpc";

  const query = trpc.example.query();
</script>

{$query.data.message}
