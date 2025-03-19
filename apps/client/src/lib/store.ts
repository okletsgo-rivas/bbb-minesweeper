import { writable, readable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';
import type { ITile } from './Tile.svelte';

export let chat = writable<string[]>([]);
export let field = writable<any[]>([]);
export let serverRoom = writable<any>();

interface IGameSession {
  sessionId: string;
  id: string;
}

export const connect = async () => {
  const client = new Client("ws://localhost:2567");
  const gameSessionString = window.sessionStorage.getItem('bbb-minesweeper');
  let room: Room;

  try {
    if (gameSessionString) {
      const gameSession: IGameSession = JSON.parse(gameSessionString);
      room = await client.reconnect(gameSession.id, gameSession.sessionId);
      room.send('message', 'reconnected!')
    } else {
      room = await client.joinOrCreate<any>("game", { size: { width: 9, height: 9 } });
      const gameSession: string = JSON.stringify({ id: room.id, sessionId: room.sessionId });
      window.sessionStorage.setItem('bbb-minesweeper', gameSession);
    }

    serverRoom.set(room);

    room.state.field.onAdd = (tile: ITile) => {
      field.update((state) => [...state, tile]);
    }

    room.state.messages.onAdd = (message: string) => {
      chat.update((state) => [...state, message]);
    };

  } catch (e) {
    window.sessionStorage.removeItem('bbb-minesweeper');
    console.error(e);
    connect();
  }
}