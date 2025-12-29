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
				<td>
					<span class="weather-forecast-table__time-label">
						<span>{forecastPeriod.label.split('-')[0]}</span>
						-
						<span>{forecastPeriod.label.split('-')[1]}</span>
					</span>
				</td>
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
		font-size: var(--font-size--base);
	}
	.weather-forecast-table th {
		color: transparent;
	}
	.weather-forecast-table td {
		padding-right: 1rem;
	}
	.weather-forecast-table tr > :first-child {
		width: 5ch;
	}
	.weather-forecast-table__time-label {
		display: flex;
		justify-content: space-between;
		gap: 0.5ch;
	}
	.weather-forecast-table__time-label span:first-child,
	.weather-forecast-table__time-label span:last-child {
		text-align: right;
		width: 2ch;
	}
	.weather-forecast-table tr > :nth-child(2) {
		text-align: center;
		width: 2rem;
	}
	.weather-forecast-table tr > :nth-child(n + 3) {
		width: auto;
		text-align: right;
	}
	.weather-forecast-table tr > :last-child {
		padding-right: 0;
	}
</style>
