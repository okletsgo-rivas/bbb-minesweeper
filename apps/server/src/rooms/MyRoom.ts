import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Minesweeper } from "../game/Minesweeper";


const defaultOptions = {
  size: { width: 5, height: 5 }
}
export class MyRoom extends Room<MyRoomState> {

  onCreate(options: any = defaultOptions) {
    this.setState(new MyRoomState());
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
  }

  onLeave(client: Client, consented: boolean) {
    const msg = `${client.sessionId} left!`;
    console.log(msg);
    this.broadcast("message", msg);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
