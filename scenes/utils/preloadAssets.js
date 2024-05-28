// scenes/utils/preloadAssets.js

export function preloadAssets(scene) {
  scene.load.image('forest_tree', 'items/forest_tree.png');
  scene.load.image('grass_tile', 'tiles/basic_tile.png');
  scene.load.image('shrub', 'items/shrub.png');
  scene.load.image('tower1', 'towers/tower.png');
  scene.load.image('bridge', 'items/bridge.png');

  scene.load.tilemapTiledJSON('map', '../../resources/hexMap.json');

  scene.load.spritesheet('glow', 'cards/glow.png', { frameWidth: scene.player_w, frameHeight: scene.player_h });
  scene.load.spritesheet('heat', 'cards/heat.png', { frameWidth: scene.player_w, frameHeight: scene.player_h });
  scene.load.spritesheet('pink', 'cards/pink.png', { frameWidth: scene.player_w, frameHeight: scene.player_h });
  scene.load.spritesheet('sonny', 'cards/sonny.png', { frameWidth: scene.player_w, frameHeight: scene.player_h });
  scene.load.spritesheet('rat', 'cards/rat.png', { frameWidth: scene.player_w, frameHeight: scene.player_h });
}