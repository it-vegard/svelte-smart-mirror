<script lang="ts">
	import { asset } from '$app/paths';
	import { fetchLocationForecast, fetchNowCast, type NowCastDataT } from '$lib/api.yr';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import WeatherSymbolAndTemperature from './WeatherSymbolAndTemperature.svelte';
	import WeatherDetails from './WeatherDetails.svelte';
	import WeatherForecastTable from './WeatherForecastTable.svelte';

	type FormattedWeather = {
		now: {
			temperature?: number;
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
	let forecast: {
		startHour: number;
		endHour: number;
		label: string;
		precipitation: number | undefined;
		symbol: string | undefined;
		temperature: number | undefined;
		windStrength: number | undefined;
	}[];

	onMount(async () => {
		const currentHour = new Date().getHours();
		const nowCastData = await fetchNowCast();
		const locationForecast = await fetchLocationForecast();
		// console.log('NowCast', nowCastData); // TODO: Remove when done with implementation
		// console.log('Forecast', locationForecast); // TODO: Remove when done with implementation
		const timeseriesHoursLookupArray = [0, 6, 12, 18, 0, 6, 12, 18, 0]; // To cover 24 hours ahead
		const firstTimeEnd = timeseriesHoursLookupArray.find((hour) => hour >= currentHour) ?? 0;
		forecast = [0, 1, 2, 3]
			.map((_, index) => {
				if (index === 0) return [currentHour, firstTimeEnd];
				else {
					const lookupIndex = timeseriesHoursLookupArray.indexOf(firstTimeEnd);
					return [
						timeseriesHoursLookupArray[lookupIndex + index - 1],
						timeseriesHoursLookupArray[lookupIndex + index]
					];
				}
			})
			.map(([startHour, endHour]) => {
				const locationForecastForPeriod = locationForecast.properties.timeseries.find(
					(entry) => new Date(entry.time).getHours() === startHour
				).data;
				const instantForecast = locationForecastForPeriod.instant.details;
				const next6HoursForecast = locationForecastForPeriod.next_6_hours?.details;
				return {
					startHour,
					endHour,
					label: `${startHour < 10 ? `0${startHour}` : startHour}-${endHour < 10 ? `0${endHour}` : endHour}`,
					precipitation: next6HoursForecast.precipitation_amount,
					symbol: locationForecastForPeriod.next_6_hours?.summary?.symbol_code,
					temperature: instantForecast.air_temperature,
					windStrength: instantForecast.wind_speed,
					locationForecastForPeriod
				};
			});
		// console.log('Timeseries for forecast', forecast);
		weatherData = {
			now: {
				precipitation: hasRadarCoverage(nowCastData)
					? nowCastData.properties.timeseries[0].data.next_1_hours.details.precipitation_amount
					: undefined,
				temperature: hasRadarCoverage(nowCastData)
					? nowCastData.properties.timeseries[0].data.instant.details.air_temperature
					: undefined,
				symbol: hasRadarCoverage(nowCastData)
					? nowCastData.properties.timeseries[0].data.next_1_hours.summary.symbol_code
					: undefined,
				wind: hasRadarCoverage(nowCastData)
					? {
							strength: nowCastData.properties.timeseries[0].data.instant.details.wind_speed,
							direction:
								nowCastData.properties.timeseries[0].data.instant.details.wind_from_direction,
							gusts: nowCastData.properties.timeseries[0].data.instant.details.wind_speed_of_gust
						}
					: undefined,
				error: hasRadarCoverage(nowCastData) ? undefined : 'No radar coverage'
			}
			/* forecastData: locationForecast.properties.timeseries.map((entry) => {
				const dateFormatter = new Intl.DateTimeFormat('no-NO', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					timeZone: 'Europe/Oslo'
				});
				const time = dateFormatter.format(new Date(entry.time));
				const isoTime = new Date(entry.time).toISOString();
				const originalTime = entry.time;
				const instant = entry.data.instant;
				const temperature = instant.details.air_temperature;
				const next_1_hours = entry.data.next_1_hours;
				const symbol = next_1_hours?.summary?.symbol_code;
				const precipitation = next_1_hours?.details.precipitation_amount;
				return {
					time,
					isoTime,
					originalTime,
					symbol,
					precipitation,
					temperature
				};
			})*/
		};
		// console.log('Formatted weather data', weatherData); // TODO: Remove when done with implementation
	});
</script>

{#if weatherData}
	<div>
		<h2>Været nå</h2>
		{#if weatherData.now.error}
			<p>{weatherData.now.error}</p>
		{:else}
			<div style="width: fit-content;">
				<div style="display: flex; flex-direction: row; gap: 10rem; align-items: center;">
					<WeatherSymbolAndTemperature
						symbol={weatherData.now.symbol}
						temperature={weatherData.now.temperature}
					/>
					<WeatherDetails
						precipitationAmount={weatherData.now.precipitation}
						windStrength={weatherData.now.wind?.strength}
					/>
				</div>
				<WeatherForecastTable {forecast} />
			</div>
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
