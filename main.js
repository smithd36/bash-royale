import Phaser from "phaser";
import GameScene from "./src/phaser/scenes/GameScene";

const sizes = {
  width: 320,
  height: 540,
};

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  parent: 'game-container',
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false, // this controls the collision boxes visibility
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
