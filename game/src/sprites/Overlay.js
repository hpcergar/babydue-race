
const MARGIN = 100

export default class {
    constructor (game) {
        // Starts
        this.game = game

        //Add the sprite to the game and enable arcade physics on it
        this.overlay = this.game.add.sprite(0, 0, 'black-pixel');
        this.resize()

        this.overlay.height = 4 * this.overlay.height // Ugly quick hack
    }

    resize() {
        this.overlay.position.x = this.game.camera.x - MARGIN
        this.overlay.position.y = this.game.camera.y - MARGIN
        this.overlay.width = this.game.camera.width + 2*MARGIN
        this.overlay.height = this.game.camera.height > this.overlay.height
            ? this.game.camera.height + 2*MARGIN
            : this.overlay.height

        console.log('overlay', this.overlay.position, this.overlay.width, this.overlay.height)
    }

    update() {
        this.resize()
    }

    getObject() {
        return this.overlay;
    }

    fade(duration = 1000, callback = () => {}, alpha = 0){
        this.resize()
        let overlayFadeIn = this.game.add.tween(this.overlay).to({alpha: alpha}, duration, "Linear");
        overlayFadeIn.onComplete.addOnce(callback)
        overlayFadeIn.start();
    }

}