import Phaser from "phaser";
import CardInterface from "./CardInterface";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.tile_w = 64;
    this.tile_h = 90;
    this.player_w = 64;
    this.player_h = 64;
    this.cursor;
    this.target;
  }

  preload() {
    // Load in the tiles/map
    this.load.image('tiles', 'tiles/tiles_1.png');
    this.load.image('hex_sheet', 'tiles/hex_tilesheet.png');
    this.load.image('brown_tree', 'items/brown_tree.png');
    this.load.image('tower', 'towers/tower.png');

    this.load.tilemapTiledJSON('map', 'resources/hexMap.json');

    // Load card sprites
    this.load.spritesheet('glow', 'cards/glow.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('heat', 'cards/heat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('pink', 'cards/pink.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('sonny', 'cards/sonny.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('rat', 'cards/rat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  }

  create() {
    // map
    const map = this.make.tilemap({ key: "map" });

    // Add tileset image to the map
    const tiles = map.addTilesetImage('tiles_1', 'tiles');
    const hex_sheet = map.addTilesetImage('hex_sheet', 'hex_sheet');
    const brown_tree = map.addTilesetImage('brown_tree', 'brown_tree');
    const tower = map.addTilesetImage('tower3', 'tower');

    // Layers
    const bgLayer = map.createLayer('tiles', [tiles, hex_sheet, brown_tree, tower], 0, 0);
    const object1 = map.createLayer('object1', [tiles, hex_sheet, brown_tree, tower], 0, 0);

    // Create the card interface
    this.cardInterface = new CardInterface(this, ['glow', 'heat', 'sonny', 'pink', 'rat']);
  }

  update() {
    // Game update logic...
  }
}
