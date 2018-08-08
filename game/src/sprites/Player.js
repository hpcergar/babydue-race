
export default class {
    constructor (game) {
        // Starts
        this.game = game

        const [startX, startY] = this.getStartPoint(game.attr.playerPoints)
        //Add the sprite to the game and enable arcade physics on it
        this.player = this.game.add.sprite(startX, startY, 'player');

        this.game.physics.arcade.enable(this.player);

        // Set gravity center in the middle
        this.player.anchor.x = 0.5;
        // Little jump after a big jump
        this.player.body.debug = true;
        // this.player.body.bounce.y = 0.2;

        // this.player.body.linearDamping = 1;
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 650;

        this.player.animations.add('right', [0,1,2], 10, true)
        // this.player.animations.play('right')

        //Make the camera follow the sprite
        this.game.camera.follow(this.player);

        this.game.slopes.enable(this.player);

        this.player.body.slopes.preferY = true;

        // this.player.body.slopes.pullUp = 150;
        this.player.body.slopes.pullDown = 350;
        // this.player.body.slopes.pullTopRight = 1500;
        // this.player.body.slopes.pullBottomRight = 1500;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.lookingRight = true;

    }

    getObject() {
        return this.player;
    }

    update (hitting) {
        this.player.body.velocity.x = 0;

        let hittingGround = hitting && this.player.body.touching.down,
            slopeUpFactor

        // Disable last jump bug on slopes
        if(this.player.body.allowGravity && hitting && this.player.isOnSlope){
            this.player.body.velocity.y = 0
        }

        // Jump
        if (this.cursors.up.isDown && hittingGround)
        {
            // this.player.body.allowGravity = true
            this.player.body.velocity.y = this.player.isOnSlope ? -450 : -350
        }

        slopeUpFactor = this.slopeUpFactor(this.player.isOnSlope, this.player.body.velocity.y)

        if (this.cursors.left.isDown)
        {
            if(this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = false;}
            this.player.body.velocity.x = -300 + slopeUpFactor;
        }
        else if (this.cursors.right.isDown)
        {
            if(!this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = true;}
            this.player.body.velocity.x = 300 - slopeUpFactor;
        }
    }

    slopeUpFactor(isOnSlope, y){
        return (isOnSlope && y < 0) ? 100 : 0
    }

    /**
     * Retrieve game player starting point
     * @param points
     * @returns {*[]}
     */
    getStartPoint(points) {
        const startPoint = points.find(point => point.name === 'playerStartPoint')
        return [startPoint.x, startPoint.y]
    }
}