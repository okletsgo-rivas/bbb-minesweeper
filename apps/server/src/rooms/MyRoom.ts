import { Room, Client } from "colyseus";
import { MyRoomState, Tile } from "./schema/MyRoomState";

const TileType = {
  MINE: "MINE",
  NUMBER: "NUMBER",
  BLANK: "BLANK",
};

const defaultOptions = {
  size: { width: 5, height: 5 }
}
export class MyRoom extends Room<MyRoomState> {

  onCreate(options: any = defaultOptions) {
    this.setState(new MyRoomState());
    this.onMessage("message", (client, message) => {
      console.log("ChatRoom received message from", client.sessionId, ":", message);
      this.broadcast("message", `${client.sessionId}: ${message}`);
      this.state.messages.push(`${client.sessionId}: ${message}`);
    });
    this.onMessage("tile", this.state.actionHandler);

    const w = options.size.width;
    const h = options.size.height;
    const field =
      Array.from(Array(w * h)).map((_, i) => {
        const tile = new Tile();
        tile.index = i;
        tile.x = i % w;
        tile.y = Math.floor(i / w);
        tile.id = `cell-${tile.x}-${tile.y}`;
        tile.type = "";
        tile.label = "";
        tile.flag = false;
        // tile.ref= null;
        tile.hide = true;

        return tile;
      });

    const mineRatio = 0.20625; // classic windows xp ratio
    let minesToPlace = Math.round(w * h * mineRatio);
    while (minesToPlace > 0) {
      let tile = field[Math.floor(Math.random() * field.length)];
      if (tile.type !== TileType.MINE) {
        tile.type = TileType.MINE;
        tile.label = "X";
        minesToPlace--;
      }
    }
    // field = field;
    const mines = field.filter((_) => _.type === TileType.MINE);
    const noMines = field.filter((_) => _.type !== TileType.MINE);

    noMines.forEach((tile) => {
      const totalMines = mines.filter(
        (mine) =>
          Math.abs(tile.x - mine.x) <= 1 && Math.abs(tile.y - mine.y) <= 1
      ).length;
      tile.type = totalMines ? TileType.NUMBER : TileType.BLANK;
      tile.label = totalMines ? totalMines.toString() : "&nbsp;";
    });
    this.state.field = field;
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    // this.broadcast("field", this.state.field);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
