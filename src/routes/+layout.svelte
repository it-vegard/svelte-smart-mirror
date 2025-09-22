<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		body {
			background-color: #000;;
			color: #fff;
		}
	</style>
</svelte:head>

{@render children?.()}
