<script>
	const { color } = $props();
</script>

<svg
	width="800px"
	height="800px"
	viewBox="0 0 64 64"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	aria-hidden="true"
	role="img"
	class="iconify iconify--emojione"
	preserveAspectRatio="xMidYMid meet"
>
	<ellipse class="hole" ry="7.10526" rx="21.05263" cy="56.73684" cx="21.07895" />
	<path
		class="flag"
		fill={color}
		d="m60.04737,12.38488c-1.9,-0.57622 -33.1,-9.98774 -37.7,-11.33224l0,25.28947c4.5,-1.3445 35.7,-10.75603 37.6,-11.33224c1.6,-0.44817 1.6,-2.17682 0.1,-2.62498"
	/>
	<path class="pole" d="M14.5 0h3.9v61.5h-3.9z" />
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
		transform: scaleX(-100%);
	}
	.hole {
		fill: #000;
	}
	.pole {
		fill: #000;
	}
</style>
