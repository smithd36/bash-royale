class Card {
    constructor(sprite, health, attackPower, special) {
        this.name = name;
        this.cost = cost;
        this.cooldown = cooldown;
        this.effect = effect;
        this.isAvailable = True;
    }

    play(target) {
        if (this.isAvailable) {
            this.effect.apply(target);
            this.startCooldown();
        }
    }

    startCooldown() {
        this.isAvailable = False;
        setTimeout(() => this.isAvailable = True, this.cooldown);
        setTimeout(() => {
            this.isAvailable = True;
        }, this.cooldown * 1000);
    }
}