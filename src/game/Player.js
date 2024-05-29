class Player {
    constructor(name, initialResources) {
        this.name = name;
        this.resources = initialResources;
        this.hand = [];
        this.deck = [];
    }

    addCardToDeck(card) {
      this.deck.push(card);
    }
    
    drawCard() {
      if (this.deck.length > 0 && this.hand.length < 5) {
        const card = this.deck.shift();
        this.hand.push(card);
      }
    }

    playCard(cardIndex, target) {
        if (cardIndex < this.hand.length && this.resources >= this.hand[cardIndex].cost) {
            this.hand[cardIndex].play(target);
            this.resources -= this.hand[cardIndex].cost;
            this.hand.splice(cardIndex, 1);
        }
    }

    regenerateResources() {
        this.resources += 1;
    }
}