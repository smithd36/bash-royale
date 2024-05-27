import EasyStar from 'easystarjs';

export class Pathfinding {
  constructor(tilemap, tilesetLayer) {
    if (!tilemap || !tilesetLayer) {
      console.error('Tilemap or tilesetLayer is not defined');
      return;
    }

    this.easystar = new EasyStar.js();
    this.tilemap = tilemap;
    this.tilesetLayer = tilesetLayer;

    const grid = [];
    for (let y = 0; y < tilemap.height; y++) {
      const col = [];
      for (let x = 0; x < tilemap.width; x++) {
        col.push(this.getTileID(x, y));
      }
      grid.push(col);
    }
    this.easystar.setGrid(grid);

    const acceptableTiles = [];
    tilesetLayer.layer.data.forEach(row => {
      row.forEach(tile => {
        if (tile && tile.index > -1) acceptableTiles.push(tile.index);
      });
    });

    this.easystar.setAcceptableTiles(acceptableTiles);
  }

  getTileID(x, y) {
    const tile = this.tilemap.getTileAt(x, y, true, this.tilesetLayer);
    return tile ? tile.index : -1;
  }

  findPath(startX, startY, endX, endY, callback) {
    if (!this.easystar) {
      console.error('EasyStar is not initialized');
      return;
    }
    this.easystar.findPath(startX, startY, endX, endY, callback);
    this.easystar.calculate();
  }
}
