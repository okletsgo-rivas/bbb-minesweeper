import App from './App.svelte';
import { mount } from "svelte";

const app = mount(App, {
  target: document.body,
  props: {
    width: 9,
    height: 9
  }
});

export default app;