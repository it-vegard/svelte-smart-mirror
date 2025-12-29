<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { date } from 'valibot';

	// Reactive variable to hold the current time
	let currentTime = new Date();
	let intervalId: NodeJS.Timeout | undefined;

	onMount(() => {
		// Update the time every second
		intervalId = setInterval(() => {
			currentTime = new Date();
		}, 1000);
	});

	onDestroy(() => {
		// Clear the interval when the component is removed
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	// Derived reactive variables for display formatting
	$: hours = currentTime.getHours().toString().padStart(2, '0');
	$: minutes = currentTime.getMinutes().toString().padStart(2, '0');
	$: seconds = currentTime.getSeconds().toString().padStart(2, '0');
	$: dateString = currentTime.toLocaleDateString('nb-NO', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="clock">
	{hours}:{minutes}:{seconds}
</div>
<div class="date">{dateString}</div>

<style>
	.clock {
		font-family: monospace;
		font-size: var(--font-size--xlarge);
		display: inline-block;
	}
	.date {
		font-size: var(--font-size--medium);
		margin-top: 0.5rem;
		text-transform: capitalize;
	}
</style>
