import "./style.css";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

const sizes = {
  width: 800,
  height: 600,
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
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
