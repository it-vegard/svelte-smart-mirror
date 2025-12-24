<script>
	import Clock from '$lib/components/clock/Clock.svelte';
	import EnturTavla from '$lib/components/transport/EnturTavla.svelte';
	import WeatherNow from '$lib/components/weather/WeatherNow.svelte';
</script>

<main>
	<div class="clock">
		<Clock />
	</div>
	<div class="weather">
		<WeatherNow />
	</div>
	<div class="transport">
		<EnturTavla stopId="58246" />
	</div>
</main>

<style :global>
	:root {
		--font-size: 16px;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		padding: 1rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		font-size: calc(var(--font-size) * 0.5);
	}

	@media (min-width: 960px) {
		main {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				'clock clock'
				'transport weather';
			gap: 3rem;
			padding: 0.5rem;
			margin: 0 auto;
			justify-content: space-between;
			align-content: space-between;
			font-size: var(--font-size);
		}
	}

	@media (min-width: 1400px) {
		main {
			gap: 3rem 20rem;
			padding: 1rem;
			max-width: 1200px;
		}
	}

	.clock {
		grid-area: clock;
	}

	.weather {
		grid-area: weather;
	}

	.transport {
		grid-area: transport;
	}
</style>
