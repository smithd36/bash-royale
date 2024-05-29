class Tower {
    constructor (health, attackRange, attackDamage) {
        this.health = health;
        this.attackRange = attackRange;
        this.attackDamage = attackDamage;
        this.isAlive = true;
    }

    takeDamage() {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
            console.log('Tower has been destroyed');
        }
    }

    attack(enemy) {
        if(this.isWithinRange(enemy)) {
            enemy.takeDamage(this.attackRange);
        }
    }

    isWithinRange(enemy) {
        return true; // should tower damage enemy if within range?
    }
}