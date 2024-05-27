// scenes/utils/preloadAssets.js

export function preloadAssets() {
  this.player_w = 64;
  this.player_h = 64;
  this.tile_w = 64;
  this.tile_h = 90;

  this.load.image('tiles', 'tiles/tiles_1.png');
  this.load.image('hex_sheet', 'tiles/hex_tilesheet.png');
  this.load.image('brown_tree', 'items/brown_tree.png');
  this.load.image('tower', 'towers/brick_house_2.png');
  this.load.image('flags', 'items/flags-sprites.png');

  this.load.tilemapTiledJSON('map', '../../resources/hexMap.json');

  this.load.spritesheet('glow', 'cards/glow.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  this.load.spritesheet('heat', 'cards/heat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  this.load.spritesheet('pink', 'cards/pink.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  this.load.spritesheet('sonny', 'cards/sonny.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  this.load.spritesheet('rat', 'cards/rat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
}