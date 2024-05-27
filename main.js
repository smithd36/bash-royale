import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 320,
  height: 540,
};

class GameScene extends Phaser.Scene {
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
    // Map
    const map = this.make.tilemap({ key: "map" });

    // Add tileset image to the map
    const tiles = map.addTilesetImage('tiles_1', 'tiles');
    const hex_sheet = map.addTilesetImage('hex_sheet', 'hex_sheet');
    const brown_tree = map.addTilesetImage('brown_tree', 'brown_tree');
    const tower = map.addTilesetImage('tower3', 'tower');

    // Layers
    const bgLayer = map.createLayer('tiles', [tiles, hex_sheet, brown_tree, tower], 0, 0);
    const object1 = map.createLayer('object1', [tiles, hex_sheet, brown_tree, tower], 0, 0);

    // Cards
    this.createCards();
  }

  createCards() {
    // Define animations for each direction for each card
    const cards = ['glow', 'heat', 'sonny', 'pink', 'rat'];
    cards.forEach(card => {
      this.anims.create({
        key: `${card}_walk_forward`,
        frames: this.anims.generateFrameNumbers(card, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${card}_walk_left`,
        frames: this.anims.generateFrameNumbers(card, { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${card}_walk_right`,
        frames: this.anims.generateFrameNumbers(card, { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${card}_walk_back`,
        frames: this.anims.generateFrameNumbers(card, { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: `${card}_walk_still`,
        frames: this.anims.generateFrameNumbers(card, { start: 1, end: 1 }),
        frameRate: 0,
        repeat: 0
      });
    });

    // Positioning for card thumbnails
    const cardPositions = [
      { x: 32, y: 400 },
      { x: 96, y: 400 },
      { x: 160, y: 400 },
      { x: 224, y: 400 },
      { x: 288, y: 400 },
    ];

    // Create card thumbnails with animations
    this.cards = cardPositions.map((pos, index) => {
      const cardKey = cards[index];
      const card = this.add.sprite(pos.x, pos.y, cardKey)
        .setInteractive()
        .setData('cardKey', cardKey)
        .play(`${cardKey}_walk_still`);

      // Add action functions for card abilities
      card.on('pointerdown', () => {
        this.activateCardAbility(cardKey);
      });

      return card;
    });

    // Add event listeners for card selection
    this.input.on('gameobjectdown', this.selectCard, this);
  }

  movePlayerAlongPath(player, path) {
    let waypointIndex = 0;

    const moveToNextWaypoint = () => {
      if (waypointIndex < path.length) {
        const { x, y } = path[waypointIndex];
        const duration = 1000; // Time to move to the next waypoint

        this.tweens.add({
          targets: player,
          x: x,
          y: y,
          duration: duration,
          onComplete: () => {
            waypointIndex++;
            moveToNextWaypoint();
          }
        });
      }
    };

    moveToNextWaypoint();
  }

  selectCard(pointer, gameObject) {
    // Deselect all cards
    this.cards.forEach(card => card.clearTint());
    // Highlight selected card
    gameObject.setTint(0x0000FF); // blue

    // Store the selected card
    this.selectedCard = gameObject.getData('cardKey');
    console.log('Selected card:', this.selectedCard);
  }

  activateCardAbility(cardKey) {
    // Define the abilities for each card
    switch (cardKey) {
      case 'glow':
        console.log('Glow card ability activated!');
        break;
      case 'heat':
        console.log('Heat card ability activated!');
        break;
      case 'sonny':
        console.log('Sonny card ability activated!');
        break;
      case 'pink':
        console.log('Pink card ability activated!');
        break;
      case 'rat':
        console.log('Rat card ability activated!');
        break;
      default:
        console.log('Unknown card:', cardKey);
    }
  }

  update() {
    // Game update logic...
  }
}

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