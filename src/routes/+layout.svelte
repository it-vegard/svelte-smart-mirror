<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		:root {
			--font-size: 14px;
			font-size: var(--font-size);
		}

		@media (min-width: 600px) {
			:root {
				font-size: calc(var(--font-size) * 1.2);
			}
		}

		body {
			background-color: #000;
			color: #fff;
			font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
			padding: 1rem;
		}
	</style>
</svelte:head>

{@render children?.()}
