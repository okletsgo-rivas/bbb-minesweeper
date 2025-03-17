import { Tile } from "../rooms/schema/GameRoomState";

export const TileType = {
  MINE: "MINE",
  NUMBER: "NUMBER",
  BLANK: "BLANK",
};

export function Minesweeper(width: number, height: number): Tile[] {
  const w = width;
  const h = height;
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
      tile.player = null;
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

  return field;
}