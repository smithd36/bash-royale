class BattleSystem {
    constructor(cards) {
        this.cards = cards;
        this.currentCard = 0;
    }

    nextTurn() {
        let attacker = this.characters[this.activeCharacter];
        let target = this.characters.find(char => char !== attacker && char.isAlive);
    
        if (target) {
          attacker.attack(target);
        }
    
        this.activeCharacter = (this.activeCharacter + 1) % this.characters.length;
        if (!this.characters[this.activeCharacter].isAlive) {
          this.nextTurn();
        }
    }

    checkWinner() {
        return this.characters.filter(char => char.isAlive).length === 1;
    }
}