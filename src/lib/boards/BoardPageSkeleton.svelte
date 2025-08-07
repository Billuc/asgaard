<div class="mx-auto my-3 h-8 w-60 skeleton bg-base-content/30"></div>

<div class="mb-4 flex flex-row justify-center gap-2">
	{#each [1, 2, 3] as i (i)}
		<div class="h-8 w-20 skeleton bg-base-content/30"></div>
	{/each}
</div>

<div>
	{#each [1, 2, 3] as i (i)}
		<div class="mb-4 h-64 w-full skeleton bg-base-content/30"></div>
	{/each}
</div>
