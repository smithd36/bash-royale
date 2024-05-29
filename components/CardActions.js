function updateAnimationDirection(gameObject, dragX, dragY) {
  const lastX = gameObject.getData('lastX');
  const lastY = gameObject.getData('lastY');

  if (Math.abs(dragX - lastX) > 10 || Math.abs(dragY - lastY) > 10) {
      const direction = determineDirection(lastX, lastY, dragX, dragY);
      gameObject.anims.play(`${gameObject.getData('cardKey')}_walk_${direction}`, true);
      gameObject.setData('lastX', dragX);
      gameObject.setData('lastY', dragY);
  }
}

export function addEvents(scene) {
  scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setData('startX', gameObject.x);
      gameObject.setData('startY', gameObject.y);
  });

  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      updateAnimationDirection(gameObject, dragX, dragY);
  });

  scene.input.on('dragend', (pointer, gameObject) => {
      const finalGridX = Math.floor(pointer.x / scene.tile_w);
      const finalGridY = Math.floor(pointer.y / scene.tile_h);
      if (isValidCoordinate(scene, finalGridX, finalGridY)) {
          moveCardToTarget(gameObject.getData('cardKey'), finalGridX, finalGridY, gameObject, scene);
      } else {
          console.error("Invalid move");
          gameObject.x = gameObject.getData('startX');
          gameObject.y = gameObject.getData('startY');
      }
  });

  scene.input.on('pointerdown', (pointer) => {
    const clickedCard = scene.cards.find(card => card.getBounds().contains(pointer.x, pointer.y));
    
    if (scene.selectedCard && clickedCard !== scene.selectedCard) {
        // Second click to define target position
        const targetX = Math.floor(pointer.x / scene.tile_w);
        const targetY = Math.floor(pointer.y / scene.tile_h);
        moveCardToTarget(scene.selectedCard.getData('cardKey'), targetX, targetY, scene.selectedCard, scene);
        clearHighlightedArea(scene.selectedCard); // Optional: clear selection visuals
        scene.selectedCard = null; // Deselect after moving
    } else if (clickedCard) {
        // First click to select character
        if (scene.selectedCard) {
            clearHighlightedArea(scene.selectedCard); // Clear previous selections if any
        }
        scene.selectedCard = clickedCard; // Set the new selected card
        selectCard(scene, pointer, clickedCard);
    }
  });

}

function determineDirection(lastX, lastY, currentX, currentY) {
  const deltaX = currentX - lastX;
  const deltaY = currentY - lastY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
  } else {
      return deltaY > 0 ? 'forward' : 'back';  // Adjust these based on your game's coordinate system
  }
}

export function selectCard(scene, pointer, gameObject) {
  if (scene.selectedCard && scene.selectedCard !== gameObject) {
    clearHighlightedArea(scene.selectedCard);
  }
  scene.selectedCard = gameObject;
  highlightAllowedArea(scene, gameObject);

  gameObject.setData('lastX', gameObject.x);
  gameObject.setData('lastY', gameObject.y);
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
  if (!isValidCoordinate(scene, targetGridX, targetGridY)) {
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
/**
function isValidCoordinate(scene, startX, startY, targetGridX, targetGridY) {
  return true
}
export function isValidCoordinate(gameObject, targetX, targetY, scene) {
  return new Promise((resolve) => {
    const startX = Math.floor(gameObject.x / scene.tile_w)
    const startY = Math.floor(gameObject.y / scene.tile_h)

    scene.pathfinding.findPath(startX, startY, targetX, targetY, (path) => {
      if (path === null) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
*/


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


export function isValidCoordinate(scene, x, y) {
  // If the tile has collides set to true, it is not a valid coordinate
  const tile = scene.pathfinding.tilemap.getTileAt(x, y, true, scene.collisionLayer);
  return tile ? !tile.properties.collides : false;
}

export function clearHighlightedArea(card) {
  if (card && card.highlightedTiles) {
    card.highlightedTiles.forEach(tile => tile.destroy());
    card.highlightedTiles = [];
  }
}