// scenes/utils/setupMap.js

export function setupMap() {
  const map = this.make.tilemap({ key: "map" });

  const tiles = map.addTilesetImage('tiles_1', 'tiles');
  const hex_sheet = map.addTilesetImage('hex_sheet', 'hex_sheet');
  const brown_tree = map.addTilesetImage('brown_tree', 'brown_tree');
  const tower = map.addTilesetImage('tower3', 'tower');

  const bgLayer = map.createLayer('tiles', [tiles, hex_sheet, brown_tree, tower], 0, 0);
  const object1 = map.createLayer('object1', [tiles, hex_sheet, brown_tree, tower], 0, 0);

  // Ensure bgLayer and object1 layers are defined and part of the map
  if (!bgLayer || !object1) {
    console.error('Layers are not defined in the tilemap');
    return null;
  }

  return { map, bgLayer, object1 };
}
