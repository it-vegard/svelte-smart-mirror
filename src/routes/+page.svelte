<script>
	import EnturTavla from '$lib/components/transport/EnturTavla.svelte';
	import WeatherNow from '$lib/components/weather/WeatherNow.svelte';
</script>

<main>
	<WeatherNow />
	<EnturTavla stopId="58246" />
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto;
		grid-template-areas: 'weather transport';
		gap: 2rem;
		padding: 1rem;
		justify-content: baseline;
	}
</style>
