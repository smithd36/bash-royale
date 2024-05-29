class Card {
    constructor(sprite, health, attackPower, special) {
        this.sprite = sprite;
        this.health = health;
        this.attackPower = attackPower;
        this.special = special;
        this.isAlive = True
    }

    getSprite() {
        return this.sprite;
    }

    attack(target) {
        if (target.isAlive) {
            target.takeDamage(this.attackPower);
            
            // Need to play something here for each card?
            // Probably need a new parameter for this
            // this.sprite.play('<card_attack??>');
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    specialAbility(target) {
        this.special(target);
    }

    die() {
        this.isAlive = False;
        // Need to play something here for each card?
        // Probably need a new parameter for this
        // this.sprite.play('<card_die??>');
    }
}