<script lang="ts">
	export let src: string;
	export let alt: string = '';
	export let size: number = 32;
</script>

<img {src} {alt} width={size} height={size} />
