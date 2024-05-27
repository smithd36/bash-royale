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

    // Enable dragging
    scene.input.setDraggable(card);
  
    return card;
  });

  /// Drag events
  scene.input.on('dragstart', (pointer, gameObject) => {
    // Store initial positions for calculating direction
    gameObject.setData('startX', gameObject.x);
    gameObject.setData('startY', gameObject.y);
  });

  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    const lastX = gameObject.getData('lastX');
    const lastY = gameObject.getData('lastY');

    // Update position
    gameObject.x = dragX;
    gameObject.y = dragY;

    // Calculate direction only if there's a significant change
    if (Math.abs(dragX - lastX) > 10 || Math.abs(dragY - lastY) > 10) {
        let direction = determineDirection(lastX, lastY, dragX, dragY);
        gameObject.anims.play(`${gameObject.getData('cardKey')}_walk_${direction}`, true);
        gameObject.setData('lastX', dragX);
        gameObject.setData('lastY', dragY);
    }
});

scene.input.on('dragend', (pointer, gameObject) => {
    const finalGridX = Math.floor(pointer.x / scene.tile_w);
    const finalGridY = Math.floor(pointer.y / scene.tile_h);

    // Only now, check if the move is valid
    if (isValidMove(gameObject, finalGridX, finalGridY)) {
        moveCardToTarget(gameObject.getData('cardKey'), finalGridX, finalGridY, gameObject, scene);
    } else {
        console.error("Invalid move");
        // Optionally, move the gameObject back to its original position
        gameObject.x = gameObject.getData('startX');
        gameObject.y = gameObject.getData('startY');
    }
  });

  function determineDirection(lastX, lastY, currentX, currentY) {
    const deltaX = currentX - lastX;
    const deltaY = currentY - lastY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'forward' : 'back';  // Adjust these based on your game's coordinate system
    }
  }


  // Click events
  scene.input.on('pointerdown', (pointer) => {
    if (scene.selectedCard) {
      clearHighlightedArea(scene.selectedCard);
      scene.selectedCard = null;
    } else {
      // Check if the click was on a card
      const card = scene.cards.find(c => c.getBounds().contains(pointer.x, pointer.y));
      if (card) {
        selectCard(scene, pointer, card);
      }
    }
  });
}

export function selectCard(scene, pointer, gameObject) {
  if (scene.selectedCard && scene.selectedCard !== gameObject) {
    clearHighlightedArea(scene.selectedCard);
  }
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


export function moveCardToTarget(cardKey, targetGridX, targetGridY, gameObject, scene) {
  const card = scene.cards.find(c => c.getData('cardKey') === cardKey);
  if (!card) return;

  // Use initial position to start the path
  const startX = Math.floor(gameObject.getData('startX') / scene.tile_w);
  const startY = Math.floor(gameObject.getData('startY') / scene.tile_h);

  // Verify if movement is allowed (optional, based on your game logic)
  if (!isValidMove(scene, startX, startY, targetGridX, targetGridY)) {
      console.error("Invalid move");
      return;
  }

  // Pathfinding from the initial to the final position
  scene.pathfinding.findPath(startX, startY, targetGridX, targetGridY, (path) => {
      if (path) {
          moveAlongPath(scene, card, path);
      } else {
          console.log("Path not found");
      }
  });
}

function isValidMove(scene, startX, startY, targetGridX, targetGridY) {
  // Implement per card logic
  if (startX === targetGridX && startY === targetGridY) return false;
  return true
}


export function moveAlongPath(scene, card, path) {
  let waypointIndex = 0;

  const moveToNextWaypoint = () => {
      if (waypointIndex < path.length) {
          const { x, y } = path[waypointIndex];
          const worldX = x * scene.tile_w + scene.tile_w / 2;
          const worldY = y * scene.tile_h + scene.tile_h / 2;
          const duration = 300;

          let direction = determineDirection(card.x, card.y, worldX, worldY); // Calculate direction
          card.anims.play(`${card.getData('cardKey')}_walk_${direction}`, true);

          scene.tweens.add({
              targets: card,
              x: worldX,
              y: worldY,
              duration: duration,
              onComplete: () => {
                  waypointIndex++;
                  if (waypointIndex < path.length) {
                      moveToNextWaypoint();
                  } else {
                      card.anims.play(`${card.getData('cardKey')}_walk_still`);
                  }
              }
          });
      }
  };

  moveToNextWaypoint();
}

function determineDirection(currentX, currentY, nextX, nextY) {
  const deltaX = nextX - currentX;
  const deltaY = nextY - currentY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
          return 'right';  // Moving right
      } else {
          return 'left';   // Moving left
      }
  } else {
      if (deltaY > 0) {
          return 'forward'; // Moving down (or forward in some games)
      } else {
          return 'back';   // Moving up (or back in some games)
      }
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

// Fr special abilities, we can add more properties to the cardDefinitions object and for now it is basically a placeholder for the special abilities
// These would be the first steps to implement special abilities for the cards primarily as test
const cardDefinitions = {
  'glow': { range: 5, directions: ['forward', 'back', 'left', 'right'], special: 'jump' },
  'heat': { range: 3, directions: ['forward', 'back'], special: 'none' },
  'sonny': { range: 4, directions: ['left', 'right'], special: 'diagonal' },
  'pink': { range: 2, directions: ['forward', 'back', 'left', 'right'], special: 'none' },
  'rat': { range: 6, directions: ['forward', 'left', 'right'], special: 'jump' }
};