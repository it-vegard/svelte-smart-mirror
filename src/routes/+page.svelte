<script lang="ts">
	import Clock from '$lib/components/clock/Clock.svelte';
	import EnturTavla from '$lib/components/transport/EnturTavla.svelte';
	import WeatherNow from '$lib/components/weather/WeatherNow.svelte';
	import { PUBLIC_ENTUR_STOP_PLACE_ID } from '$env/static/public';
</script>

<main>
	<div class="clock">
		<Clock />
	</div>
	<div class="weather">
		<WeatherNow />
	</div>
	<div class="transport">
		<EnturTavla stopId={PUBLIC_ENTUR_STOP_PLACE_ID} />
	</div>
</main>

<style :global>
	:root {
		--font-size--base: clamp(16px, 5vw, 28px);
		--font-size--heading: calc(var(--font-size--base) * 1.3);
		--font-size--xlarge: calc(var(--font-size--base) * 3.5);
		--font-size--large: calc(var(--font-size--base) * 2.5);
		--font-size--medium: calc(var(--font-size--base) * 1.25);
		--font-size--small: calc(var(--font-size--base) * 0.75);
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		font-size: var(--font-size--base);
	}

	@media (min-width: 762px) {
		:root {
			--font-size--base: 20px;
		}

		main {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				'clock clock'
				'transport weather';
			gap: 2rem;
			padding: 0.5rem;
			margin: 0 auto;
			justify-content: space-between;
			align-content: space-between;
		}
	}

	@media (min-width: 960px) {
		:root {
			--font-size--base: 22px;
		}

		main {
			padding: 3rem;
		}
	}

	@media (min-width: 1400px) {
		:root {
			--font-size--base: 30px;
		}

		main {
			--font-size--base: 30px;
			gap: 3rem 15rem;
			padding: 1rem;
			max-width: 80%;
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
