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
      .setData('movementRange', cardDefinitions[cardKey].range)
      .setData('movementDirections', cardDefinitions[cardKey].directions)
      .setData('specialAbility', cardDefinitions[cardKey].special)
      .play(`${cardKey}_walk_still`);
  
    card.on('pointerdown', (pointer) => {
      selectCard(scene, pointer, card);
    });
  
    return card;
  });

  scene.input.on('gameobjectdown', (pointer, gameObject) => {
    selectCard(scene, pointer, gameObject);
  });
}

export function selectCard(scene, pointer, gameObject) {
  if (scene.selectedCard) {
    // If there is a previously selected card, clear highlights
    clearHighlightedArea(scene.selectedCard);
  }

  // Set the new selected card
  scene.selectedCard = gameObject;
  highlightAllowedArea(scene, gameObject);
}

export function highlightAllowedArea(scene, card) {
  // Clear existing highlights if any
  if (card.highlightedTiles) {
    card.highlightedTiles.forEach(tile => tile.destroy());
    card.highlightedTiles = [];
  } else {
    card.highlightedTiles = [];
  }

  const range = card.getData('movementRange');
  const directions = card.getData('movementDirections');
  const special = card.getData('specialAbility');
  const startX = Math.floor(card.x / scene.tile_w);
  const startY = Math.floor(card.y / scene.tile_h);

  const checkDirection = (dx, dy) => {
    if (directions.includes('forward') && dy < 0) return true;
    if (directions.includes('back') && dy > 0) return true;
    if (directions.includes('left') && dx < 0) return true;
    if (directions.includes('right') && dx > 0) return true;
    return false;
  };

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (special === 'diagonal' && Math.abs(dx) === Math.abs(dy)) {
        highlightTile(scene, card, startX, startY, dx, dy);
      } else if (special === 'jump' && (Math.abs(dx) <= range && Math.abs(dy) <= range)) {
        highlightTile(scene, card, startX, startY, dx, dy);
      } else if (checkDirection(dx, dy)) {
        highlightTile(scene, card, startX, startY, dx, dy);
      }
    }
  }
}

function highlightTile(scene, card, startX, startY, dx, dy) {
  const x = startX + dx;
  const y = startY + dy;
  if (isValidCoordinate(scene, x, y)) {
    const worldX = x * scene.tile_w + scene.tile_w / 2;
    const worldY = y * scene.tile_h + scene.tile_h / 2;
    const rect = scene.add.rectangle(worldX, worldY, scene.tile_w, scene.tile_h, 0x00ff00, 0.2);
    card.highlightedTiles.push(rect);
  }
}

export function isValidCoordinate(scene, x, y) {
  return x >= 0 && x < scene.pathfinding.tilemap.width && y >= 0 && y < scene.pathfinding.tilemap.height;
}

export function clearHighlightedArea(card) {
  if (card && card.highlightedTiles) {
    card.highlightedTiles.forEach(tile => tile.destroy());
    card.highlightedTiles = [];
  }
}

const cardDefinitions = {
  'glow': { range: 5, directions: ['forward', 'back', 'left', 'right'], special: 'jump' },
  'heat': { range: 3, directions: ['forward', 'back'], special: 'none' },
  'sonny': { range: 4, directions: ['left', 'right'], special: 'diagonal' },
  'pink': { range: 2, directions: ['forward', 'back', 'left', 'right'], special: 'none' },
  'rat': { range: 6, directions: ['forward', 'left', 'right'], special: 'jump' }
};
