import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
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

export class Player extends Schema {
  @type("string") username: string;
  @type("string") sessionId: string;
  @type("number") score: number = 0;
  @type("boolean") winner: boolean = false;

  constructor(username: string, sessionId: string) {
    super();

    this.sessionId = sessionId;
    this.username = username;
  }
}

export class GameRoomState extends Schema {
  @type(["string"])
  messages: string[] = new ArraySchema<string>();

  @type([Tile])
  field: Tile[] = new ArraySchema<Tile>();

  @type({ map: Player })
  players = new MapSchema<Player>();

  gameOver: any;

  actionHandler = (client: Client, { id, action }: ITileMessage) => {
    const tile: Tile = this.getTileById(id);
    switch (action) {
      case 'select':
        this.updateTileSelect(client.sessionId, tile);
        break;
      case 'flag':
        this.updateTileFlag(client.sessionId, tile);
        break;
    }

    if (!this.field.some((_: Tile) => _.hide && !_.flag)) {
      this.endGame();
    }
  }

  private endGame() {
    const msg = 'Game Over!';
    console.log(msg);
    this.messages.push(msg);

    this.field.forEach((tile: Tile) => {
      if (tile.player) {
        const player: Player = this.players.get(tile.player);
        if (tile.flag) {
          player.score += tile.type === TileType.MINE ? 10 : -20;
        } else if (tile.type === TileType.MINE) {
          player.score += -50;
        }
      }
    });

    let winner: Player;
    this.players.forEach((player: Player) => {
      if (!winner) {
        winner = player;
      } else if (winner.score === player.score) {
        winner = null;
      } else {
        winner = winner.score > player.score ? winner : player;
      }
    });

    this.gameOver = { winner, players: this.players };

    if (winner) {
      this.messages.push(winner.sessionId + ' wins the game!');
    } else {
      this.messages.push('Tied game!');
    }

    this.players.forEach((player: Player) => {
      this.messages.push(`${player.sessionId}: ${player.score}`);
    });
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
