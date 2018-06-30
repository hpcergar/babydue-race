
export default class {
    constructor (game) {
        // Starts
        this.game = game
        //Add the sprite to the game and enable arcade physics on it
        this.player = this.game.add.sprite(32, 32, 'player');
        this.game.physics.arcade.enable(this.player);

        // Set gravity center in the middle
        this.player.anchor.x = 0.5;
        // Little jump after a big jump
        this.player.body.bounce.y = 0.2;

        // this.player.body.linearDamping = 1;
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 650;
        // this.player.body.drag.x = 700
        this.player.body.friction.x = 0

        this.player.animations.add('right', [0,1,2], 10, true)
        this.player.animations.play('right')

        //Make the camera follow the sprite
        this.game.camera.follow(this.player);

        this.game.slopes.enable(this.player);
        // this.game.slopes.preferY = true;
        this.player.body.slopes.preferY = true;

        // this.player.body.slopes.pullUp = 150;
        this.player.body.slopes.pullDown = 150;
        // this.player.body.slopes.pullTopRight = 1500;
        // this.player.body.slopes.pullBottomRight = 1500;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.lookingRight = true;

    }

    getObject() {
        return this.player;
    }

    update () {
        this.player.body.velocity.x = 0;

        let hittingGround = this.player.body.touching.down;

        // Disable gravity if touching ground
        this.player.body.allowGravity = !hittingGround

        if (this.cursors.up.isDown)
        {
            if (this.player.body.touching.down)
            {
                this.player.body.velocity.y = -350;
            }
        }

        if (this.cursors.left.isDown)
        {
            if(this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = false;}
            this.player.body.velocity.x = -300;
        }
        else if (this.cursors.right.isDown)
        {
            if(!this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = true;}
            this.player.body.velocity.x = 300;
        }
    }
}