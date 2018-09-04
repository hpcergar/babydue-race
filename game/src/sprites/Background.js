'use strict';

export default class {
    constructor(game, map) {
        this.game = game
        this.game.stage.backgroundColor = '#787878';
        // this.backgroundTilesprite = this.game.add.tileSprite(0, 0, 2048, 1024, 'background');
        this.backgroundTilesprite = this.game.add.sprite(0, -150, 'background');
        // this.backgroundTilesprite.width = 2048;
        // this.backgroundTilesprite.height = 1024;
        this.backgroundTilesprite.width = 1350;
        this.backgroundTilesprite.height = 900;

        this.backgroundTilesprite.fixedToCamera = true
    }

    update() {
        // Simulate parallax
        // this.backgroundTilesprite.tilePosition.set(this.game.camera.x * -0.5, 0)
    }
}