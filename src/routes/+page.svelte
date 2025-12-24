<script>
	import Clock from '$lib/components/clock/Clock.svelte';
	import EnturTavla from '$lib/components/transport/EnturTavla.svelte';
	import WeatherNow from '$lib/components/weather/WeatherNow.svelte';
</script>

<main>
	<div class="slot">
		<Clock />
	</div>
	<div class="slot">
		<EnturTavla stopId="58246" />
	</div>
	<div class="slot">
		<WeatherNow />
	</div>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			'clock clock'
			'weather transport';
		gap: 1rem 20rem;
		padding: 1rem;
		justify-content: baseline;
	}

	.slot:nth-child(1) {
		grid-area: clock;
	}

	.slot:nth-child(2) {
		grid-area: weather;
	}

	.slot:nth-child(3) {
		grid-area: transport;
	}
</style>
