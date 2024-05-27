import Phaser from "phaser";

export default class CardInterface {
  constructor(scene, cardKeys) {
    this.scene = scene;
    this.cardKeys = cardKeys;
    this.cards = [];
    this.visibleCards = 3; // Number of cards visible at a time
    this.currentIndex = 0;
    this.createCards();
    this.createNavigationButtons();
  }

  createCards() {
    const cardPositions = [
      { x: 64, y: this.scene.scale.height - 100 },
      { x: 160, y: this.scene.scale.height - 100 },
      { x: 256, y: this.scene.scale.height - 100 },
    ];

    // Create card thumbnails with animations
    for (let i = 0; i < this.visibleCards; i++) {
      const cardKey = this.cardKeys[this.currentIndex + i];
      const pos = cardPositions[i];
      const card = this.scene.add.sprite(pos.x, pos.y, cardKey)
        .setInteractive()
        .setData('cardKey', cardKey)
        .play(`${cardKey}_walk_still`);

      // Add action functions for card abilities
      card.on('pointerdown', () => {
        this.activateCardAbility(cardKey);
      });

      this.cards.push(card);
    }
  }

  createNavigationButtons() {
    this.prevButton = this.scene.add.text(32, this.scene.scale.height - 100, '<', { fontSize: '32px', fill: '#FFF' })
      .setInteractive()
      .on('pointerdown', () => this.cycleCards(-1));

    this.nextButton = this.scene.add.text(this.scene.scale.width - 64, this.scene.scale.height - 100, '>', { fontSize: '32px', fill: '#FFF' })
      .setInteractive()
      .on('pointerdown', () => this.cycleCards(1));
  }

  cycleCards(direction) {
    this.currentIndex += direction;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    if (this.currentIndex + this.visibleCards > this.cardKeys.length) {
      this.currentIndex = this.cardKeys.length - this.visibleCards;
    }

    this.cards.forEach(card => card.destroy());
    this.cards = [];
    this.createCards();
  }

  activateCardAbility(cardKey) {
    // Define the abilities for each card
    switch (cardKey) {
      case 'glow':
        console.log('Glow card ability activated!');
        break;
      case 'heat':
        console.log('Heat card ability activated!');
        break;
      case 'sonny':
        console.log('Sonny card ability activated!');
        break;
      case 'pink':
        console.log('Pink card ability activated!');
        break;
      case 'rat':
        console.log('Rat card ability activated!');
        break;
      default:
        console.log('Unknown card:', cardKey);
    }
  }
}
