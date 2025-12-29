<script lang="ts">
	export let src: string;
	export let alt: string = '';

	$: isSvg = !!src.endsWith('.svg');
	$: svgRoute = `${src}?raw`;

	function fetchSvg(svgRoute: string) {
		return new Promise((resolve) => {
			fetch(svgRoute)
				.then((response) => response.text())
				.then((svg) => resolve(svg));
		});
	}
</script>

{#if isSvg}
	{#await fetchSvg(svgRoute)}
		<div>loading...</div>
	{:then value}
		{@html value}
	{/await}
{:else}
	<img {src} {alt} />
{/if}
