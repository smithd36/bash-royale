// scenes/utils/setupMap.js
export function setupMap() {
  const map = this.make.tilemap({ key: "map" });

  const tiles = map.addTilesetImage('grass_tile', 'grass_tile');
  const forest_tree = map.addTilesetImage('forest_tree', 'forest_tree');
  const shrub = map.addTilesetImage('shrub', 'shrub');
  const tower = map.addTilesetImage('tower1', 'tower1');
  const bridge = map.addTilesetImage('bridge', 'bridge');

  const bgLayer = map.createLayer('tiles', [tiles, forest_tree, shrub, tower, bridge], 0, 0);
  const collisionLayer = map.createLayer('collisionLayer', [tiles, forest_tree, shrub, tower, bridge], 0, 0);
  collisionLayer.setCollisionByProperty({ collides: true });

  // Ensure bgLayer and collisionLayer layers are defined and part of the map
  if (!bgLayer || !collisionLayer) {
    console.error('Layers are not defined in the tilemap');
    return null;
  }

  return { map, bgLayer, collisionLayer };
}

export function setupCards(scene) {
    const cards = ['glow', 'heat', 'sonny', 'pink', 'rat', 'bird', 'clown', 'graycat', 'orangecat'];

    cards.forEach(cardKey => {
        createCardAnimations(scene, cardKey);
    });
  
    const cardPositions = [
      { x: 96, y: 400 },
      { x: 96, y: 500 },
      { x: 160, y: 400 },
      { x: 224, y: 500 },
      { x: 224, y: 400 },
      { x: 288, y: 200 },
      { x: 96, y: 100 },
      { x: 160, y: 100 },
      { x: 224, y: 100 }
    ];
  
    scene.cards = cardPositions.map((pos, index) => {
      const cardKey = cards[index];
      const card = scene.physics.add.sprite(pos.x, pos.y, cardKey)
        .setInteractive()
        .setData('cardKey', cardKey)
        .setData('movementRange', cardDefinitions[cardKey].range)
        .setData('movementDirections', cardDefinitions[cardKey].directions)
        .setData('specialAbility', cardDefinitions[cardKey].special)
        .play(`${cardKey}_walk_still`);
  
      // Enable dragging
      scene.input.setDraggable(card);    
      return card;
    });
  }

  export function createCardAnimations(scene, card) {
    // Movement animations
    const directions = ['forward', 'left', 'right', 'back'];
    directions.forEach((dir, index) => {
    scene.anims.create({
            key: `${card}_walk_${dir}`,
            frames: scene.anims.generateFrameNumbers(card, { start: index * 4, end: (index * 4) + 3 }),
            frameRate: 10,
            repeat: -1
        });
    });
  
    // The player-facing frame when player is not moving
    scene.anims.create({
        key: `${card}_walk_still`,
        frames: scene.anims.generateFrameNumbers(card, { start: 1, end: 1 }),
        frameRate: 0,
        repeat: 0
    });
  }
  
// Fr special abilities, we can add more properties to the cardDefinitions object and for now it is basically a placeholder for the special abilities
// These would be the first steps to implement special abilities for the cards primarily as test
export const cardDefinitions = {
  'glow': { range: 5, directions: ['forward', 'back', 'left', 'right'], special: 'jump' },
  'heat': { range: 3, directions: ['forward', 'back'], special: 'none' },
  'sonny': { range: 4, directions: ['left', 'right'], special: 'diagonal' },
  'pink': { range: 2, directions: ['forward', 'back', 'left', 'right'], special: 'none' },
  'rat': { range: 6, directions: ['forward', 'left', 'right'], special: 'jump' },
  'bird': { range: 6, directions: ['forward', 'left', 'right'], special: 'shoot' },
  'clown': { range: 6, directions: ['forward', 'left', 'right'], special: 'double' },
  'graycat': { range: 6, directions: ['forward', 'left', 'right'], special: 'none' },
  'orangecat': { range: 6, directions: ['forward', 'left', 'right'], special: 'none' }
};