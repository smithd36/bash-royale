// scenes/utils/setupMap.js
import { createCardAnimations, cardDefinitions, addEvents, selectCard, moveCardToTarget } from "../../components/CardActions";

export function setupMap() {
  const map = this.make.tilemap({ key: "map" });

  const tiles = map.addTilesetImage('grass_tile', 'grass_tile');
  const forestTree = map.addTilesetImage('forestTree', 'forestTree');
  const shrubsheet = map.addTilesetImage('shrubsheet', 'shrubsheet');
  const tower = map.addTilesetImage('tower1', 'tower1');

  const bgLayer = map.createLayer('tiles', [tiles, forestTree, shrubsheet, tower], 0, 0);
  const object1 = map.createLayer('object1', [tiles, forestTree, shrubsheet, tower], 0, 0);

  // Ensure bgLayer and object1 layers are defined and part of the map
  if (!bgLayer || !object1) {
    console.error('Layers are not defined in the tilemap');
    return null;
  }

  return { map, bgLayer, object1 };
}

export function setupCards(scene) {
    const cards = ['glow', 'heat', 'sonny', 'pink', 'rat'];

    cards.forEach(cardKey => {
        createCardAnimations(scene, cardKey);
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
  
      // Enable dragging
      scene.input.setDraggable(card);
    
      return card;
    });
  
    /// Add click and drag events (player interation)
    addEvents(scene);
  }