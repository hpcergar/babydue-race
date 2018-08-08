'use strict';

export default class {
    constructor(game, map) {
        this.game = game
        this.game.stage.backgroundColor = '#787878';
        this.backgroundTilesprite = this.game.add.tileSprite(0, 0, 2048, 1024, 'background');
        this.backgroundTilesprite.fixedToCamera = true
    }

    update() {
        // Simulate parallax
        this.backgroundTilesprite.tilePosition.set(this.game.camera.x * -0.5, 0)
    }
}