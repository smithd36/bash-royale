import Phaser from "phaser";
import { preloadAssets } from "./utils/preloadAssets";
import { setupMap } from "./utils/SetupMap";
import { Pathfinding } from "./utils/pathfinding";
import { createCards, selectCard, highlightAllowedArea, clearHighlightedArea, isValidCoordinate } from "../components/CardActions";

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

    // Handle target selection and movement
    this.input.on('pointerdown', (pointer) => {
      if (this.selectedCard) {
        const targetX = pointer.worldX;
        const targetY = pointer.worldY;
        this.moveCardToTarget(this.selectedCard.getData('cardKey'), targetX, targetY);
      }
    });
  }

  moveCardToTarget(cardKey, targetX, targetY) {
    const card = this.cards.find(c => c.getData('cardKey') === cardKey);
    if (!card) return;

    const startX = Math.floor(card.x / this.tile_w);
    const startY = Math.floor(card.y / this.tile_h);

    // Convert targetX and targetY from pixels to grid coordinates
    const targetGridX = Math.floor(targetX / this.tile_w);
    const targetGridY = Math.floor(targetY / this.tile_h);

    // Calculate distance to target
    const distance = Math.abs(targetGridX - startX) + Math.abs(targetGridY - startY);
    const allowedRange = card.getData('movementRange');

    if (distance > allowedRange) {
      console.error("Target is out of range");
      return;
    }

    const allowedDirections = card.getData('movementDirections');
    const dx = targetGridX - startX;
    const dy = targetGridY - startY;

    let direction;
    if (dx > 0) direction = 'right';
    else if (dx < 0) direction = 'left';
    else if (dy > 0) direction = 'forward';
    else if (dy < 0) direction = 'back';

    if (!allowedDirections.includes(direction)) {
      console.error("Direction not allowed");
      return;
    }

    if (isValidCoordinate(this, startX, startY) && isValidCoordinate(this, targetGridX, targetGridY)) {
      this.pathfinding.findPath(startX, startY, targetGridX, targetGridY, (path) => {
        if (path === null) {
          console.log("Path not found");
        } else {
          this.moveAlongPath(card, path);
          clearHighlightedArea(card); // Clear the highlighted area as movement starts
        }
      });
    } else {
      console.error("Start or target coordinate is out of bounds");
    }
  }

  moveAlongPath(card, path) {
    let waypointIndex = 0;

    const moveToNextWaypoint = () => {
      if (waypointIndex < path.length) {
        const { x, y } = path[waypointIndex];
        const worldX = x * this.tile_w + this.tile_w / 2;
        const worldY = y * this.tile_h + this.tile_h / 2;
        const duration = 1000; // Adjust duration as needed

        // Determine direction
        const nextWaypoint = path[waypointIndex + 1];
        let direction = 'still';
        if (nextWaypoint) {
          if (nextWaypoint.y < y) direction = 'back';
          else if (nextWaypoint.y > y) direction = 'forward';
          else if (nextWaypoint.x < x) direction = 'left';
          else if (nextWaypoint.x > x) direction = 'right';
        }

        // Play corresponding animation
        const cardKey = card.getData('cardKey');
        card.play(`${cardKey}_walk_${direction}`);

        this.tweens.add({
          targets: card,
          x: worldX,
          y: worldY,
          duration: duration,
          onComplete: () => {
            waypointIndex++;
            moveToNextWaypoint();
          }
        });
      } else {
        // Stop animation at the end of the path
        const cardKey = card.getData('cardKey');
        card.play(`${cardKey}_walk_still`);
      }
    };

    moveToNextWaypoint();
  }
}

export default GameScene;
