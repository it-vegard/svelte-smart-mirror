<script lang="ts">
	export let precipitationAmount: number;
	export let windStrength: number;
</script>

<div class="weather-details">
	<div>
		<strong>Nedbør:</strong>
		{precipitationAmount}
	</div>
	{#if windStrength !== undefined}
		<div>
			<strong>Vindstyrke:</strong>
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
</style>
