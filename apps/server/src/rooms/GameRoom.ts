import { Room, Client } from "colyseus";
import { GameRoomState, Player } from "./schema/GameRoomState";
import { Minesweeper } from "../game/Minesweeper";


const defaultOptions = {
  size: { width: 5, height: 5 }
}
export class GameRoom extends Room<GameRoomState> {

  maxClients: number = 2;

  onCreate(options: any = defaultOptions) {
    this.setState(new GameRoomState());

    this.onMessage("message", (client, message) => {
      console.log("Chat from", client.sessionId, ":", message);
      this.state.messages.push(`${client.sessionId}: ${message}`);
    });
    this.onMessage("tile", this.state.actionHandler);

    const { width, height } = options.size;

    this.state.field = Minesweeper(width, height);
  }

  onJoin(client: Client, options: any) {
    const msg = `${options.username} joined!`;
    console.log(msg);
    this.state.messages.push(msg);
    this.state.players.set(client.sessionId, new Player(options.username, client.sessionId));
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId).username;
    const msg = `${player} left!`;
    console.log(msg);
    this.state.messages.push(msg);

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      const reconnect = await this.allowReconnection(client, 20);
      const msg = `${player} reconnected!`;
      console.log(msg);
      this.state.messages.push(msg);
    } catch (e) {
      this.disconnect();
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
