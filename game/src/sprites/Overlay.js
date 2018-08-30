
export default class {
    constructor (game) {
        // Starts
        this.game = game

        //Add the sprite to the game and enable arcade physics on it
        this.overlay = this.game.add.sprite(0, 0, 'black-pixel');
        this.overlay.tint = '#000000';
        this.resize()
    }

    resize() {
        // console.log('resize', window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
        this.overlay.scale.setTo(this.game.camera.width, this.game.camera.height);
    }

    getObject() {
        return this.overlay;
    }

    fadeOut(){
        this.game.add.tween(this.overlay).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

}