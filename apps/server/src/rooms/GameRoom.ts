import { Room, Client } from "colyseus";
import { GameRoomState } from "./schema/GameRoomState";
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
      this.broadcast("message", `${client.sessionId}: ${message}`);
      this.state.messages.push(`${client.sessionId}: ${message}`);
    });
    this.onMessage("tile", this.state.actionHandler);

    const { width, height } = options.size;

    this.state.field = Minesweeper(width, height);
  }

  onJoin(client: Client, options: any) {
    const msg = `${client.sessionId} joined!`;
    console.log(msg);
    this.broadcast("message", msg);
    this.state.messages.push(msg);
  }

  async onLeave(client: Client, consented: boolean) {
    const msg = `${client.sessionId} left!`;
    console.log(msg);
    this.broadcast("message", msg);
    this.state.messages.push(msg);

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      await this.allowReconnection(client, 20);
    } catch (e) {
      this.disconnect();
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
