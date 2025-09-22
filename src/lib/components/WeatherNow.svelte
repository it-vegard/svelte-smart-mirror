<script lang="ts">
  import { fetchNowCast } from '$lib/api.yr';
  import { onMount } from 'svelte';

  let weatherData: { temp: number; condition: string } | null = null;

  onMount(async () => {
    const data = await fetchNowCast();
    console.log("Response", data);
    weatherData = {
      temp: data.properties.timeseries[0].data.instant.details.air_temperature,
      condition: data.properties.timeseries[0].data.instant.details.weather_symbol,
    };
  });
</script>

{#if weatherData}
  <div>
    <h2>Weather Now</h2>
    <p>Temperature: {weatherData.temp}°C</p>
    <p>Condition: {weatherData.condition}</p>
  </div>
{:else}
  <p>Loading...</p>
{/if}