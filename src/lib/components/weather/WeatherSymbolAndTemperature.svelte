<script lang="ts">
	import { asset } from '$app/paths';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import Image from '../Image.svelte';

	export let symbol: WeatherSymbolKeyT | undefined;
	export let temperature: number | undefined;

	const mainElement = document.getElementsByTagName('main')[0];
	const fontSize = window.getComputedStyle(mainElement).getPropertyValue('font-size');
	export const symbolSize = Number.parseInt(fontSize.replace('px', '')) * 4;
</script>

{#if symbol && temperature}
	<div class="weather-symbol-and-temperature">
		{#if symbol}
			<div class="weather-symbol">
				<Image
					size={symbolSize}
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
		font-size: var(--font-size--large);
		margin: 0;
	}
	.weather-symbol-and-temperature {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: var(--font-size--medium);
		/* Add more styles as needed */
	}
	.weather-symbol {
		width: var(--font-size--xlarge);
		height: var(--font-size--xlarge);
		margin-left: -23px;
	}
</style>
