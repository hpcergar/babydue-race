
export default class {
    constructor (game) {
        // Starts
        this.game = game

        //Add the sprite to the game and enable arcade physics on it
        this.overlay = this.game.add.sprite(0, 0, 'black-pixel');
        this.overlay.tint = '#ffffff';
        this.overlay.scale.setTo(game.world.width, game.world.height);

    }

    getObject() {
        return this.overlay;
    }

    fadeOut(){
        this.game.add.tween(this.overlay).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

}