<script lang="ts">
	import { asset } from '$app/paths';
	import { fetchLocationForecast, fetchNowCast, type NowCastDataT } from '$lib/api.yr';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import WeatherSymbolAndTemperature from './WeatherSymbolAndTemperature.svelte';

	type FormattedWeather = {
		now: {
			temp?: number;
			symbol?: WeatherSymbolKeyT;
			error?: string;
		};
		forecast: {
			time: string;
			symbol: WeatherSymbolKeyT | undefined;
			precipitation: number | undefined;
			temperature: number | undefined;
		}[];
	} | null;

	const hasRadarCoverage = (data: NowCastDataT) => data.properties.meta.radar_coverage === 'ok';

	let weatherData: FormattedWeather = null;

	onMount(async () => {
		const nowCastData = await fetchNowCast();
		const locationForecast = await fetchLocationForecast();
		console.log('NowCast', nowCastData); // TODO: Remove when done with implementation
		console.log('Forecast', locationForecast); // TODO: Remove when done with implementation
		weatherData = {
			now: {
				temp: hasRadarCoverage(nowCastData)
					? nowCastData.properties.timeseries[0].data.instant.details.air_temperature
					: undefined,
				symbol: hasRadarCoverage(nowCastData)
					? nowCastData.properties.timeseries[0].data.next_1_hours.summary.symbol_code
					: undefined,
				error: hasRadarCoverage(nowCastData) ? undefined : 'No radar coverage'
			},
			forecast: locationForecast.properties.timeseries.map((entry) => {
				const time = entry.time;
				const instant = entry.data.instant;
				const temperature = instant.details.air_temperature;
				const next_1_hours = entry.data.next_1_hours;
				const symbol = next_1_hours?.summary?.symbol_code;
				const precipitation = next_1_hours?.details.precipitation_amount;
				return {
					time,
					symbol,
					precipitation,
					temperature
				};
			})
		};
		console.log('Formatted weather data', weatherData); // TODO: Remove when done with implementation
	});
</script>

{#if weatherData}
	<div>
		<h2>Været nå</h2>
		{#if weatherData.now.error}
			<p>{weatherData.now.error}</p>
		{:else}
			<WeatherSymbolAndTemperature
				symbol={weatherData.now.symbol}
				temperature={weatherData.now.temp}
			/>
		{/if}
		<!-- Add YR weather widget for inspiration while developing my own -->
		<iframe
			title="Været i Østerliveien de neste 24 timene"
			src="https://www.yr.no/nb/innhold/10-997897/card.html?mode=dark"
			style="width: 100%; height: 372px; border: 0; border-radius: 8px;"
		></iframe>
		<!-- End of YR weather widget -->
	</div>
{:else}
	<p>Loading...</p>
{/if}
