// scenes/utils/setupMap.js
import { createCardAnimations, cardDefinitions, selectCard, moveCardToTarget } from "../../components/CardActions";

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
    const cards = ['glow', 'heat', 'sonny', 'pink', 'rat'];

    cards.forEach(cardKey => {
        createCardAnimations(scene, cardKey);
    });
  
    const cardPositions = [
      { x: 96, y: 400 },
      { x: 96, y: 500 },
      { x: 160, y: 400 },
      { x: 224, y: 500 },
      { x: 224, y: 400 },
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