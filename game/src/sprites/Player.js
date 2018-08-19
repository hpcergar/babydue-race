import Input from '../services/Input'
import Points from '../services/Points'
import Config from '../config'

const ANIMATION_STANDING = 'standing'
const ANIMATION_RUNNING = 'running'

const GAME_VELOCITY = Config.player.gameVelocity
const END_ANIMATION_VELOCITY = Config.player.endAnimationVelocity

export default class {
    constructor (game) {
        // Starts
        this.game = game
        
        // STATES
        this.isPlayable = true

        this.input = new Input(this.game)
        this.points = new Points(this.game)

        // Game key points
        const [startX, startY] = this.points.getStartPoint()
        const [endX, endY] = this.points.getEndPoint()

        this.endX = endX

        //Add the sprite to the game and enable arcade physics on it
        this.player = this.game.add.sprite(startX, startY, 'player');
        this.game.physics.arcade.enable(this.player);
        // Make the camera follow the sprite
        this.game.camera.follow(this.player);

        // PHYSICS
        // Set gravity center in the middle
        this.player.anchor.x = 0.4;
        this.player.anchor.y = 0.25;
        // this.player.body.setSize(46, 64, 0, 0)
        this.player.body.setSize(40, 64, 6, 0)
        // Little jump after a big jump
        // this.player.body.debug = true;
        // this.player.body.bounce.y = 0.2;
        // this.player.body.linearDamping = 1;
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 650;

        // this.game.debug.bodyInfo(this.player, 32, 32);
        // this.game.debug.body(this.player);
        // this.game.debug.reset();

        // ANIMATIONS
        this.player.animations.add(ANIMATION_RUNNING, [0,1,2,3,0,1,2,3,0,1,2,3,4,1,2,3], 5, true)
        this.player.animations.add(ANIMATION_STANDING,[0,0,0,0,0,0,0,0,0,0,0,0,4], 5, true)
        this.player.animations.play(ANIMATION_STANDING);
        this.lookingRight = true;

        // SLOPES
        // Enable slopes collision on this player
        this.game.slopes.enable(this.player);
        this.player.body.slopes.preferY = true;
        // this.player.body.slopes.pullUp = 150;
        this.player.body.slopes.pullDown = 350;
        // this.player.body.slopes.pullTopRight = 1500;
        // this.player.body.slopes.pullBottomRight = 1500;

        // CONTROLS
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    getObject() {
        return this.player;
    }

    update (hitting) {
        if(this.isPlayable){
            this.updatePlaying(hitting)  
        } 
    }

    updatePlaying (hitting) {

        this.game.debug.bodyInfo(this.player, 32, 32);
        this.game.debug.body(this.player);
        this.game.debug.reset();

        let wasStanding = this.player.body.velocity.x === 0

        this.player.body.velocity.x = 0;

        let hittingGround = hitting && this.player.body.touching.down,
            slopeUpFactor

        // Disable last jump bug on slopes
        if(this.player.body.allowGravity && hitting && this.player.isOnSlope){
            this.player.body.velocity.y = 0
        }

        // Jump
        if (this.input.isDown() && hittingGround)
        {
            // this.player.body.allowGravity = true
            this.player.body.velocity.y = this.player.isOnSlope ? -450 : -350
        }

        // Rotation
        this.rotateOnSlope(this.player.isOnSlope)

        slopeUpFactor = this.slopeUpFactor(this.player.isOnSlope, this.player.body.velocity.y)

        if (this.cursors.left.isDown)
        {
            if(this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = false;}
            this.player.body.velocity.x = -GAME_VELOCITY + slopeUpFactor;
        }
        else if (this.cursors.right.isDown)
        {
            if(!this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = true;}
            this.player.body.velocity.x = GAME_VELOCITY - slopeUpFactor;
        }

        if(wasStanding && this.player.body.velocity.x !== 0) {
            this.player.animations.play(ANIMATION_RUNNING)
        } else if (!wasStanding && this.player.body.velocity.x === 0){
            this.player.animations.play(ANIMATION_STANDING)
        }
    }

    /**
     *
     * @param isOnSlope
     * @param y
     * @returns {number}
     */
    slopeUpFactor(isOnSlope, y){
        return (isOnSlope && y < 0) ? 100 : 0
    }

    /**
     * Adapt angle on slope
     * @param slopeId
     */
    rotateOnSlope(slopeId) {
        if(false === slopeId && this.player.angle !== 0){
            this.player.angle = 0
        } else if(false !== slopeId) {
            switch(slopeId) {
                case 1:
                    this.player.angle = 45;
                    break;
                case 2:
                    this.player.angle = -45;
                    break;
            }
        }
    }

    isBeyondEndPoint() {
        return this.player.position.x >= this.endX
    }

    startEndAnimation() {
        this.isPlayable = false
        this.player.body.velocity.x = END_ANIMATION_VELOCITY
        this.player.animations.play(ANIMATION_RUNNING)
    }

    goToPoint(name, callback = undefined) {
        const [pointX, pointY] = this.points.getPoint(name)
        let tween = this.game.add.tween(this.player).to({
            x: pointX,
            y: this.player.position.y
        }, 750, Phaser.Easing.Quadratic.InOut);

        if(callback){
            tween.onComplete.addOnce(callback)
        }
        tween.start();

    }

}