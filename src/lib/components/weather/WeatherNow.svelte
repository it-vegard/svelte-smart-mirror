<script lang="ts">
	import { asset } from '$app/paths';
	import { fetchLocationForecast, fetchNowCast, type NowCastDataT } from '$lib/api.yr';
	import { mapWeatherSymbolToIcon, type WeatherSymbolKeyT } from '$lib/utils/weather-utils';
	import { onMount } from 'svelte';
	import Icon from '../Icon.svelte';
	import WeatherSymbolAndTemperature from './WeatherSymbolAndTemperature.svelte';
	import WeatherDetails from './WeatherDetails.svelte';
	import WeatherForecastTable from './WeatherForecastTable.svelte';

	type ForecastPeriodT = {
		startHour: number;
		endHour: number;
		label: string;
		precipitation: number | undefined;
		symbol: WeatherSymbolKeyT | undefined;
		temperature: number | undefined;
		windStrength: number | undefined;
	};

	type FormattedWeather = {
		now:
			| {
					precipitation: number;
					wind: {
						strength: number;
						direction: number;
						gusts: number;
					};
					temperature: number;
					symbol: WeatherSymbolKeyT;
			  }
			| undefined;
		forecast: ForecastPeriodT[];
		error: string;
	} | null;

	const hasRadarCoverage = (data: NowCastDataT) => data.properties.meta.radar_coverage === 'ok';

	let weatherData: FormattedWeather = null;
	let forecast: ForecastPeriodT[];

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
				)?.data;
				const instantForecast = locationForecastForPeriod?.instant.details;
				const next6HoursForecast = locationForecastForPeriod?.next_6_hours?.details;
				return {
					startHour,
					endHour,
					label: `${startHour < 10 ? `0${startHour}` : startHour}-${endHour < 10 ? `0${endHour}` : endHour}`,
					precipitation: next6HoursForecast?.precipitation_amount,
					symbol: locationForecastForPeriod?.next_6_hours?.summary?.symbol_code,
					temperature: instantForecast?.air_temperature,
					windStrength: instantForecast?.wind_speed,
					locationForecastForPeriod
				};
			});
		// console.log('Timeseries for forecast', forecast);
		weatherData = {
			now: hasRadarCoverage(nowCastData)
				? {
						precipitation:
							nowCastData.properties.timeseries[0].data.next_1_hours.details.precipitation_amount,
						temperature: nowCastData.properties.timeseries[0].data.instant.details.air_temperature,
						symbol: nowCastData.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
						wind: {
							strength: nowCastData.properties.timeseries[0].data.instant.details.wind_speed,
							direction:
								nowCastData.properties.timeseries[0].data.instant.details.wind_from_direction,
							gusts: nowCastData.properties.timeseries[0].data.instant.details.wind_speed_of_gust
						}
					}
				: undefined,
			error: !hasRadarCoverage(nowCastData) ? 'Ingen radardekning for området' : '',
			forecast
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
		{#if weatherData.error}
			<p>{weatherData.error}</p>
		{:else if weatherData.now && weatherData.forecast}
			<div style="width: fit-content;">
				<div style="display: flex; flex-direction: row; gap: 3rem; align-items: center;">
					{#if weatherData.now}
						<WeatherSymbolAndTemperature
							symbol={weatherData.now.symbol}
							temperature={weatherData.now.temperature}
						/>
						<WeatherDetails
							precipitationAmount={weatherData.now.precipitation}
							windStrength={weatherData.now.wind?.strength}
						/>
					{/if}
				</div>
				<WeatherForecastTable {forecast} />
			</div>
		{/if}

		<!-- Add YR weather widget for inspiration while developing my own -->
		<!--
    <div style="border: 1px solid white; margin-top: 3rem;">
			<iframe
				title="Været i Østerliveien de neste 24 timene"
				src="https://www.yr.no/nb/innhold/10-997897/card.html?mode=dark"
				style="width: 100%; height: 372px; border: 0; border-radius: 8px;"
			/>
		</div>
    -->
		<!-- End of YR weather widget -->
	</div>
{:else}
	<p>Loading...</p>
{/if}
