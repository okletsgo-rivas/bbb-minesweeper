import { writable, readable } from 'svelte/store';
import { Client } from 'colyseus.js';

export let chat = writable<string[]>([]);
export let field = writable<any[]>([]);
export let serverRoom = writable<any>();

export const connect = async () => {
  const client = new Client("ws://localhost:2567");
  try {
    const room = await client.joinOrCreate<any>("game", { size: { width: 9, height: 9 } });
    serverRoom.set(room);
    room.state.field.onAdd = (tile: any) => {
      field.update((state) => [...state, tile]);
      console.log('onAdd', tile);
      tile.onChange = (change: any) => {
        field.update((state) => [...state]);
      }
    }
    room.state.messages.onAdd = (message, key) => {
      console.log(message, key);
      chat.update((state) => [...state, message]);
      // messages = [...messages, message];
      // Scroll to bottom of chat
      // messages.scrollTo(0, messages.scrollHeight);
    };
  } catch (e) {
    console.error(e);
  }
}