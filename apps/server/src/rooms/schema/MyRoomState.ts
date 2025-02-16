import { Schema, ArraySchema, Context, type } from "@colyseus/schema";

const TileType = {
  MINE: "MINE",
  NUMBER: "NUMBER",
  BLANK: "BLANK",
};

export class Tile extends Schema {
  @type("number") id: number;
  @type("number") x: number;
  @type("number") y: number;
  @type("string") type: string;
  @type("string") label: string;
  @type("boolean") flag: boolean;
  @type("boolean") hide: boolean;
  @type("string") player?: string;
}
export class MyRoomState extends Schema {
  @type(["string"]) messages = new ArraySchema<string>();
  @type([Tile]) field = new ArraySchema<Tile>();

  updateTileSelect(sessionId: string, tileId: number) {
    const tile = this.field[tileId];
    console.log(tile.hide, tile.flag);
    if (tile.hide && !tile.flag) {
      tile.hide = false;
      if (tile.type === TileType.MINE) {
        tile.player = sessionId;
      }
    }
  }

  updateTileFlag(sessionId: string, tileId: number) {
    const tile = this.field[tileId];
    if (tile.hide) {
      tile.flag = !tile.flag;
      tile.player = tile.flag ? sessionId : undefined;
    }
  }
}
