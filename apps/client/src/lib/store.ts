import { get, writable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';
import type { ITile } from './Tile.svelte';
import { goto } from '$app/navigation';

export let username = writable<string>();
export let chat = writable<string[]>([]);
export let field = writable<any[]>([]);
export let serverRoom = writable<Room>();

export const EDifficulty = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  EXPERT: 'EXPERT'
};

export const connect = async (username: string, difficulty: string) => {
  const client = new Client("ws://localhost:2567");
  try {
    const room: Room = await client.joinOrCreate<any>("game", { username, difficulty });
    joinRoom(room);
    goto(`/room/${room.id}/${room.sessionId}`);
  } catch (e) {
    console.warn(e.message);
  }
}

export const reconnect = async (roomId: string, sessionId: string) => {
  const client: Client = new Client("ws://localhost:2567");
  try {
    const room: Room = await client.reconnect(roomId, sessionId);
    joinRoom(room);
  } catch (e) {
    console.warn(e.message);
    clearState();
    goto('/');
  }
}

export function clearState() {
  const room = get(serverRoom);
  if (room) {
    room.leave();
  }

  chat.set([]);
  field.set([]);
  serverRoom.set(null);
}

function joinRoom(room: Room) {
  serverRoom.set(room);

  room.state.field.onAdd = (tile: ITile) => {
    field.update((state) => [...state, tile]);
  }

  room.state.messages.onAdd = (message: string) => {
    chat.update((state) => [...state, message]);
  };
}