class GameBoard {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.units = [];
    }
  
    addUnit(unit, position) {
      if (position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height) {
        this.units.push({ unit, position });
        console.log(`Unit added at (${position.x}, ${position.y})`);
      }
    }
  
    moveUnit(unit, newPosition) {
      let foundUnit = this.units.find(u => u.unit === unit);
      if (foundUnit && newPosition.x >= 0 && newPosition.x < this.width && newPosition.y >= 0 && newPosition.y < this.height) {
        foundUnit.position = newPosition;
        console.log(`Unit moved to (${newPosition.x}, ${newPosition.y})`);
      }
    }
  
    checkCollisions() {
      // Implement logic to check for and handle collisions or interactions
    }
  }  