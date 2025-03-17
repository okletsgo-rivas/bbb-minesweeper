import { Schema, ArraySchema, type } from "@colyseus/schema";
import { Client } from "colyseus";

const TileType = {
  MINE: "MINE",
  NUMBER: "NUMBER",
  BLANK: "BLANK",
};

interface ITileMessage {
  id: string;
  action: string;
}

export class Tile extends Schema {
  @type("string") id: string;
  @type("number") index: number;
  @type("number") x: number;
  @type("number") y: number;
  @type("string") type: string;
  @type("string") label: string;
  @type("boolean") flag: boolean;
  @type("boolean") hide: boolean;
  @type("string") player?: string;

  values = () => ({
    id: this.id,
    index: this.index,
    x: this.x,
    y: this.y,
    type: this.type,
    label: this.label,
    flag: this.flag,
    hide: this.hide,
    player: this.player
  });
}
export class MyRoomState extends Schema {
  @type(["string"]) messages = new ArraySchema<string>();
  @type([Tile]) field = new ArraySchema<Tile>();

  actionHandler = (client: Client, { id, action }: ITileMessage) => {
    const tile: Tile = this.getTileById(id);
    console.log('Tile', id, action);
    switch (action) {
      case 'select':
        this.updateTileSelect(client.sessionId, tile);
        break;
      case 'flag':
        this.updateTileFlag(client.sessionId, tile);
        break;
    }
  }

  private updateTileSelect(sessionId: string, tile: Tile) {
    if (tile.hide && !tile.flag) {
      tile.hide = false;
      if (tile.type === TileType.MINE) {
        tile.player = sessionId;
      } else if (tile.type === TileType.BLANK) {
        this.emptySelectHandler(tile);
      }
    }
  }

  private updateTileFlag(sessionId: string, tile: Tile) {
    if (tile.hide) {
      if (!tile.flag) {
        tile.flag = true;
        tile.player = sessionId;
      } else if (tile.player === sessionId) {
        tile.flag = false;
        tile.player = null;
      }
    }
  }

  private emptySelectHandler(tile: Tile) {
    this.clickAdjacentTiles(tile);
  }

  private clickAdjacentTiles(tile: Tile) {
    let i, j, adjacentTile;

    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        adjacentTile = this.getTileByXY(tile.x + i, tile.y + j);
        if (adjacentTile && adjacentTile.hide && !adjacentTile.flag) {
          this.updateTileSelect(null, adjacentTile);
        }
      }
    }
  }

  private getTileById(id: string): Tile {
    return this.field.find((_: Tile) => _.id === id);
  }

  private getTileByXY(x: number, y: number): Tile {
    return this.field.find((_: Tile) => _.x === x && _.y === y);
  }
}
