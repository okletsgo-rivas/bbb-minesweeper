import { writable } from 'svelte/store';

const chat = writable<string[]>([]);
// const client = new Client("ws://localhost:2567");
// (async () => {
//   room = await client.joinOrCreate<any>("chat_room");
//   room.state.messages.onAdd = (message, key) => {
//     console.log(message, key);
//     messages = [...messages, message];
//     // Scroll to bottom of chat
//     // messages.scrollTo(0, messages.scrollHeight);
//   };
// })();