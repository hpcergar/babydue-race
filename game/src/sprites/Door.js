import Points from '../services/Points'

const ANIMATION_STANDING = 'standing'
const ANIMATION_OPENING = 'opening'
const ANIMATION_OPEN = 'open'

export default class {
    constructor (game) {
        // Starts
        this.game = game
        this.points = new Points(this.game)
    }

    render() {
        // Let's let it render anywhere outside camera
        this.object = this.game.add.sprite(this.game.camera.x - 64, this.game.camera.y, 'door');


        console.log(this.object.position.x, this.object.position.y)
        // Define animations
        this.object.animations.add(ANIMATION_STANDING, [0], 5, false)
        this.object.animations.add(ANIMATION_OPENING, [0,1,2,3,4,5,6,7], 5, false)
        this.object.animations.add(ANIMATION_OPEN, [7], 5, false)

        this.object.animations.play(ANIMATION_STANDING);
    }

    getObject() {
        return this.object;
    }

    moveToPosition() {
        //Add the sprite to the game and enable arcade physics on it
        const [doorX, doorY] = this.points.getPoint('doorPoint')
        this.object.position.x = doorX
        this.object.position.y = doorY - 94
    }

    open() {
        this.object.animations.play(ANIMATION_OPENING, 10, false);
    }

}