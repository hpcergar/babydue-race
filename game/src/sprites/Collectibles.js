

const POINTS_COIN = 1
const POINTS_STAR = 10

export default class {
    constructor (game, map, score) {
        // Starts
        this.game = game
        this.map = map
        this.score = score
        this.coins = {}
        this.stars = {}

        // Coins
        this.createCollectible('Coin', 2, 'coins', 30, 30, POINTS_COIN)
        // Stars
        this.createCollectible('Star', 32, 'stars', 45, 45, POINTS_STAR)
    }

    /**
     *
     * @param name
     * @param tileId
     * @param groupName
     * @param width
     * @param height
     * @param points
     */
    createCollectible(name, tileId, groupName, width, height, points){
        this[groupName] = this.game.add.physicsGroup();
        this.map.createFromObjects('Collectibles', name, 'autumn-objects', tileId, true, false, this[groupName]);
        this[groupName].forEach(function(collectible){
            collectible.body.immovable = true
            collectible.body.setSize(width, height, 0, 0)
            collectible.attr = {points:points}
        })
    }

    collect(player, collectible) {
        let points = collectible.attr.points
        collectible.kill();

        // Add points to score
        this.score.add(points);
    }

    update (player) {
        this.game.physics.arcade.overlap(player, this.coins, this.collect, null, this);
        this.game.physics.arcade.overlap(player, this.stars, this.collect, null, this);
    }
}