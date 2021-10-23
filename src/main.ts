import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    width: 9,
    height: 9
  }
});

export default app;