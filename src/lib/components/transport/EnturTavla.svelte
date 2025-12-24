<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fetchStop } from '$lib/api.entur.remote';
	import BusIcon from '$lib/icons/BusIcon.svelte';
	import MetroIcon from '$lib/icons/MetroIcon.svelte';

	export let stopId: string;
	let stopPlaceName: string;
	let estimatedCalls: {
		expectedDepartureTime: string;
		destinationDisplay: { frontText: string };
		transportMode: 'bus' | 'metro';
	}[];
	let loaderTimeout: NodeJS.Timeout | undefined;
	let cleanupOldDeparturesTimeout: NodeJS.Timeout | undefined;

	onMount(async () => {
		async function loadDepartures() {
			// Fetch data for the given stopId
			const result = await fetchStop(stopId);
			stopPlaceName = result.data.stopPlace.name;
			estimatedCalls = result.data.stopPlace.estimatedCalls
				.filter(
					(call: { destinationDisplay: { frontText: string } }) =>
						!['Bergkrystallen', 'Mortensrud'].includes(call.destinationDisplay.frontText)
				)
				.map(
					(call: {
						expectedDepartureTime: string;
						destinationDisplay: { frontText: string };
						quay: { stopPlace: { transportMode: string } };
					}) => ({
						expectedDepartureTime: call.expectedDepartureTime,
						destinationDisplay: call.destinationDisplay,
						transportMode: call.quay.stopPlace.transportMode[0]
					})
				);
		}
		await loadDepartures();
		loaderTimeout = setInterval(async () => {
			await loadDepartures();
		}, 300000); // Refresh every 5 minutes

		// Clean up old departures every minute
		cleanupOldDeparturesTimeout = setInterval(() => {
			const now = new Date();
			estimatedCalls = estimatedCalls.filter((call) => new Date(call.expectedDepartureTime) > now);
		}, 60000); // Clean up every 1 minute
	});

	onDestroy(() => {
		if (loaderTimeout) {
			clearInterval(loaderTimeout);
		}
		if (cleanupOldDeparturesTimeout) {
			clearInterval(cleanupOldDeparturesTimeout);
		}
	});
</script>

{#if stopPlaceName}
	<div class="entur-tavla">
		<h2 class="entur-tavla__title">Fra {stopPlaceName} mot sentrum</h2>
		{#each estimatedCalls as call}
			<div class="entur-tavla__departure">
				<span class="entur-tavla__departure__destination">
					{#if call.transportMode === 'bus'}
						<BusIcon />
					{:else if call.transportMode === 'metro'}
						<MetroIcon />
					{/if}
					{call.destinationDisplay.frontText}
				</span>
				<span class="entur-tavla__departure__time"
					>{new Date(call.expectedDepartureTime).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})}</span
				>
			</div>
		{/each}
		<!-- Render more details about the stop place as needed -->
	</div>
{:else}
	<div>Loading stop data...</div>
{/if}

<style>
	.entur-tavla {
		font-family: sans-serif;
	}
	.entur-tavla__title {
		font-size: 2rem;
	}
	.entur-tavla__departure {
		display: flex;
		margin-bottom: 0.5rem;
		padding: 4px 0;
		gap: 0 1rem;
		font-size: 1.5rem;
		justify-content: space-between;
	}
	.entur-tavla__departure__destination {
		display: flex;
		gap: 1rem;
	}
</style>
