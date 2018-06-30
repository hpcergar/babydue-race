
export default class {
    constructor (game, map) {
        // Starts
        this.game = game
        this.map = map
        this.stars = this.game.add.physicsGroup();
        this.map.createFromObjects('Coins', 'Star', 'autumn-objects', 39, true, false, this.stars);
        this.stars.forEach(function(star){
            star.body.immovable = true
        })
    }

    starCollect(player, star) {
        star.kill();
    }

    update (player) {
        this.game.physics.arcade.overlap(player, this.stars, this.starCollect, null, this);
    }
}