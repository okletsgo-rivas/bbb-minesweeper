import { writable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';
import type { ITile } from './Tile.svelte';

export let username = writable<string>('blue');
export let chat = writable<string[]>([]);
export let field = writable<any[]>([]);
export let serverRoom = writable<any>();

interface IGameSession {
  sessionId: string;
  id: string;
}

export const connect = async (username: string, size: { width: number, height: number }) => {
  const client = new Client("ws://localhost:2567");
  const room: Room = await client.joinOrCreate<any>("game", { username, size });
  setRoom(room);

  return { roomId: room.id, sessionId: room.sessionId };
}

export const reconnect = async (roomId: string, sessionId: string) => {
  const client = new Client("ws://localhost:2567");
  const room = await client.reconnect(roomId, sessionId);
  setRoom(room);
}

function setRoom(room: Room) {
  serverRoom.set(room);

  room.state.field.onAdd = (tile: ITile) => {
    field.update((state) => [...state, tile]);
  }

  room.state.messages.onAdd = (message: string) => {
    chat.update((state) => [...state, message]);
  };
}