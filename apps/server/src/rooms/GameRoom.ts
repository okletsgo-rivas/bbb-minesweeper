import { Room, Client } from "colyseus";
import { GameRoomState, Player } from "./schema/GameRoomState";
import { Minesweeper } from "../game/Minesweeper";

const EDifficulty = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  EXPERT: 'EXPERT'
};
export class GameRoom extends Room<GameRoomState> {

  maxClients: number = 2;

  onCreate(options: any) {
    this.setState(new GameRoomState());

    this.onMessage("message", (client, message) => {
      const player = this.state.players.get(client.sessionId).username;
      const msg = `${player}: ${message}`;
      console.log(msg);
      this.state.messages.push(msg);
    });
    this.onMessage("tile", this.state.actionHandler);

    let width, height, mines;

    switch (options.difficulty) {
      case EDifficulty.BEGINNER:
        width = 9;
        height = 9; mines = 10;
        break;
      case EDifficulty.INTERMEDIATE:
        width = 16;
        height = 16;
        mines = 40;
        break;
      case EDifficulty.EXPERT:
        width = 16;
        height = 16;
        mines = 99;
        break;
    }

    this.state.field = Minesweeper(width, height, mines);
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
