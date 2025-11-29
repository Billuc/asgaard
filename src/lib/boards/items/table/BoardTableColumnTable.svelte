<script lang="ts">
  import { type BoardTableColumn } from "$lib/boards/board";
  import EditTable from '$lib/common/EditTable.svelte';

  interface Props {
    columns: BoardTableColumn[];
    onupdate: (newColumns: BoardTableColumn[]) => void;
  }

  const { columns, onupdate }: Props = $props();
</script>

<EditTable>

</EditTable>
