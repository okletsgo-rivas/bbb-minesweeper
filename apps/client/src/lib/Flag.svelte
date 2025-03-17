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
  <path
    class="hole"
    d="M26.2 61.5c0 1.4-4.3 2.5-9.7 2.5c-5.4 0-9.7-1.1-9.7-2.5s4.3-2.5 9.7-2.5c5.3 0 9.7 1.2 9.7 2.5"
  />
  <path
    class="flag"
    fill={color}
    d="M56.1 17.7C54.2 16.8 23 2.1 18.4 0v39.5c4.5-2.1 35.7-16.8 37.6-17.7c1.6-.7 1.6-3.4.1-4.1"
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
    fill: #444;
  }
  .pole {
    fill: #000;
  }
</style>
