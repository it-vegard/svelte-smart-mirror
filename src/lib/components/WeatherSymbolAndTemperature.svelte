<script lang="ts">
	import { asset } from '$app/paths';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import Image from './Image.svelte';

	export let symbol: WeatherSymbolKeyT | undefined;
	export let temperature: number | undefined;
</script>

{#if symbol && temperature}
	<div class="weather-symbol-and-temperature">
		{#if symbol}
			<div class="weather-symbol">
				<Image
					size={96}
					src={asset(`/weather-symbols/darkmode/svg/${mapWeatherSymbolToIcon(symbol)}.svg`)}
					alt={symbol}
				/>
			</div>
		{/if}
		{#if temperature}
			<p class="weather__temperature">{Math.round(temperature)}°C</p>
		{/if}
	</div>
{/if}

<style>
	.weather__temperature {
		color: var(--temperature-color);
		font-weight: bold;
		font-size: 3rem;
		margin: 0;
	}
	.weather-symbol-and-temperature {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 1.2rem;
		/* Add more styles as needed */
	}
	.weather-symbol {
		width: 96px;
		height: 96px;
		margin-left: -23px;
	}
</style>
