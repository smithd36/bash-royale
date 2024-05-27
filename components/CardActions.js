export function createCards(scene) {
    const cards = ['glow', 'heat', 'sonny', 'pink', 'rat'];
    cards.forEach(card => {
      scene.anims.create({
        key: `${card}_walk_forward`,
        frames: scene.anims.generateFrameNumbers(card, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      scene.anims.create({
        key: `${card}_walk_left`,
        frames: scene.anims.generateFrameNumbers(card, { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
      scene.anims.create({
        key: `${card}_walk_right`,
        frames: scene.anims.generateFrameNumbers(card, { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
      });
      scene.anims.create({
        key: `${card}_walk_back`,
        frames: scene.anims.generateFrameNumbers(card, { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
      });
  
      scene.anims.create({
        key: `${card}_walk_still`,
        frames: scene.anims.generateFrameNumbers(card, { start: 1, end: 1 }),
        frameRate: 0,
        repeat: 0
      });
    });
  
    const cardPositions = [
      { x: 32, y: 400 },
      { x: 96, y: 400 },
      { x: 160, y: 400 },
      { x: 224, y: 400 },
      { x: 288, y: 400 },
    ];
  
    scene.cards = cardPositions.map((pos, index) => {
      const cardKey = cards[index];
      const card = scene.add.sprite(pos.x, pos.y, cardKey)
        .setInteractive()
        .setData('cardKey', cardKey)
        .setData('movementRange', 5) // Set default movement range
        .setData('movementDirections', ['forward', 'back', 'left', 'right']) // Set default movement directions
        .play(`${cardKey}_walk_still`);
  
        card.on('pointerdown', () => {
            scene.selectedCard = card;
            highlightAllowedArea(scene, card);
        });
  
      return card;
    });
  
    scene.input.on('gameobjectdown', selectCard, scene);
  }
  
  export function selectCard(scene, pointer, card) {
    scene.selectedCard = card;
    highlightAllowedArea(card);
  }
  
  export function isValidCoordinate(scene, x, y) {
    return x >= 0 && x < scene.pathfinding.tilemap.width && y >= 0 && y < scene.pathfinding.tilemap.height;
  }

  export function highlightAllowedArea(scene, card) {
    const range = card.getData('movementRange');
    const startX = Math.floor(card.x / scene.tile_w);
    const startY = Math.floor(card.y / scene.tile_h);
  
    // Highlight tiles within the allowed range
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        const x = startX + dx;
        const y = startY + dy;
        if (isValidCoordinate(scene, x, y)) {
          const worldX = x * scene.tile_w + scene.tile_w / 2;
          const worldY = y * scene.tile_h + scene.tile_h / 2;
          // Add a highlight or marker for valid tiles
          scene.add.rectangle(worldX, worldY, scene.tile_w, scene.tile_h, 0x00ff00, 0.2);
        }
      }
    }
  }
  