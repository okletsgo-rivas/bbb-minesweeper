import { writable, readable } from 'svelte/store';
import { Client } from 'colyseus.js';
import type { ITile } from './Tile.svelte';

export let chat = writable<string[]>([]);
export let field = writable<any[]>([]);
export let serverRoom = writable<any>();

export const connect = async () => {
  const client = new Client("ws://localhost:2567");
  try {
    const room = await client.joinOrCreate<any>("game", { size: { width: 9, height: 9 } });
    serverRoom.set(room);

    room.state.field.onAdd = (tile: ITile) => {
      field.update((state) => [...state, tile]);
    }

    room.state.messages.onAdd = (message) => {
      chat.update((state) => [...state, message]);
    };
  } catch (e) {
    console.error(e);
  }
}