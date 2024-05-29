class Effect {
    constructor (type, value) {
        this.type = type;
        this.value = value;
    }

    apply(target) {
        switch (this.type) {
            case 'damage':
                target.takeDamage(this.value);
                break;

            case 'heal':
                target.heal(this.value);
                break;
            // more effects as they come like spec abilitiy
        }
    }
}