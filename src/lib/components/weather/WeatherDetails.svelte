<script lang="ts">
	import PrecipitationIcon from '$lib/icons/PrecipitationIcon.svelte';
	import WindIcon from '$lib/icons/WindIcon.svelte';

	export let precipitationAmount: number;
	export let windStrength: number;
</script>

<div class="weather-details">
	<div class="weather-details__item">
		<PrecipitationIcon />
		{precipitationAmount}
	</div>
	{#if windStrength !== undefined}
		<div class="weather-details__item">
			<WindIcon />
			{windStrength} m/s
		</div>
	{/if}
</div>

<style>
	.weather-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 1.1rem;
	}

	.weather-details__item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.5rem;
	}
</style>
