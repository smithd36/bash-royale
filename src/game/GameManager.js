class GameManager {
    constructor(players, board) {
      this.players = players;
      this.board = board;
      this.currentPlayerIndex = 0;
    }
  
    nextTurn() {
      let currentPlayer = this.players[this.currentPlayerIndex];
      currentPlayer.regenerateResources();
      currentPlayer.drawCard();
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      this.board.checkCollisions();
    }
  
    startGame() {
      this.players.forEach(player => {
        player.drawCard(); // Initial draw
      });
      this.nextTurn(); // Start with the first player's turn
    }
}