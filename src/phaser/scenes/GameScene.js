import Phaser from "phaser";
import { setupMap, setupCards } from "../utils/Setup";
import { Pathfinding } from "../utils/pathfinding";
import { addEvents } from "../utils/CardActions";

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.tile_w = 64;
    this.tile_h = 90;
    this.player_w = 64;
    this.player_h = 64;
    this.cursor;
    this.target;
    this.pathfinding = null;
    this.selectedCard = null; // Track the selected card
  }

  preload() {
    // preloadAssets(this);
    /**
     * Decided to preload the character assets here as it 
     * may end up being more scalable if we have more characters
     * or maps to add in the future.
     */
    this.load.image('forest_tree', 'items/forest_tree.png');
    this.load.image('grass_tile', 'tiles/basic_tile.png');
    this.load.image('shrub', 'items/shrub.png');
    this.load.image('tower1', 'towers/tower.png');
    this.load.image('bridge', 'items/bridge.png');
  
    this.load.tilemapTiledJSON('map', '../../resources/hexMap.json');
  
    this.load.spritesheet('glow', 'cards/glow.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('heat', 'cards/heat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('pink', 'cards/pink.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('sonny', 'cards/sonny.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('rat', 'cards/rat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('bird', 'cards/bird.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('clown', 'cards/clown.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('graycat', 'cards/graycat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
    this.load.spritesheet('orangecat', 'cards/orangecat.png', { frameWidth: this.player_w, frameHeight: this.player_h });
  }

  create() {
    const mapSetup = setupMap.call(this);

    if (!mapSetup) {
      console.error('Map setup failed');
      return;
    }

    const { map, bgLayer, collisionLayer } = mapSetup;

    if (!map || !bgLayer) {
      console.error('Map or background layer is not defined.');
      return;
    }

    this.pathfinding = new Pathfinding(map, bgLayer, collisionLayer);

    // Integrate with the cards
    setupCards(this);
    addEvents(this);
  }

  update() {
  }
}
export default GameScene;