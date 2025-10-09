<script lang="ts">
	import { asset } from '$app/paths';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import Image from '../Image.svelte';

	export let forecast: {
		startHour: number;
		endHour: number;
		label: string;
		precipitation: number | undefined;
		symbol: WeatherSymbolKeyT | undefined;
		temperature: number | undefined;
		windStrength: number | undefined;
	}[];
</script>

<table class="weather-forecast-table">
	<thead>
		<tr>
			<th>Time</th>
			<th>Vær</th>
			<th>Temp</th>
			<th>Wind</th>
		</tr>
	</thead>
	<tbody>
		{#each forecast as forecastPeriod}
			<tr>
				<td>{forecastPeriod.label}</td>
				<td>
					{#if forecastPeriod.symbol !== undefined}
						<Image
							src={asset(
								`/weather-symbols/darkmode/svg/${mapWeatherSymbolToIcon(forecastPeriod.symbol)}.svg`
							)}
							alt={forecastPeriod.symbol}
						/>
					{/if}
				</td>
				<td>
					{forecastPeriod.temperature !== undefined
						? `${Math.round(forecastPeriod.temperature)}°C`
						: '-'}
				</td>
				<td>
					{forecastPeriod.windStrength !== undefined
						? `${Math.round(forecastPeriod.windStrength)} km/h`
						: '-'}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.weather-forecast-table {
		border-collapse: collapse;
		width: 100%;
	}
	.weather-forecast-table th {
		color: transparent;
	}
	.weather-forecast-table tr > :first-child {
		width: 3rem;
		text-align: left;
	}
	.weather-forecast-table tr > :not(:first-child) {
		width: auto;
		text-align: right;
	}
</style>
