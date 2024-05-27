// scenes/utils/setupMap.js

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
