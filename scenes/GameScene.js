import Phaser from "phaser";
import { preloadAssets } from "./utils/preloadAssets";
import { setupMap } from "./utils/SetupMap";
import { Pathfinding } from "./utils/pathfinding";
import { createCards, selectCard, highlightAllowedArea, isValidCoordinate, moveCardToTarget } from "../components/CardActions";

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
    preloadAssets.call(this);
  }

  create() {
    const mapSetup = setupMap.call(this);

    if (!mapSetup) {
      console.error('Map setup failed');
      return;
    }

    const { map, bgLayer, object1 } = mapSetup;

    if (!map || !bgLayer) {
      console.error('Map or background layer is not defined.');
      return;
    }

    this.pathfinding = new Pathfinding(map, bgLayer, object1);

    // Integrate the createCards function
    createCards(this);
  }
}
export default GameScene;