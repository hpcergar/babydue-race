import Config from '../config'

const MIN_WIDTH = Config.resolutions[0].width // TODO Use according resolution instead of [0]
const MIN_HEIGHT = Config.resolutions[0].height


export default class {

    constructor (game, options = {}) {

        this.minScaleFactor = options.minScaleFactor || Config.scales.minScaleFactor || 1
        this.game = game
        // Starts
        this.scaleFactor = {
            width:null,
            height:null,
            scale:1 // Starting in 1
        }
    }

    resize(scaleManager, parentBounds, force = false, callback = undefined) {
        let scaleX = parentBounds.width / MIN_WIDTH,
            scaleY = parentBounds.height / MIN_HEIGHT,
            scale = Math.max(this.minScaleFactor, Math.max(scaleX, scaleY)),
            width = ~~Math.min(parentBounds.width / scale, MIN_WIDTH),
            height = ~~Math.min(parentBounds.height / scale, MIN_HEIGHT)

        if(width) {
            console.log('width', width)
        } else {
            console.log('no width')
        }
        if(this.scaleFactor.width !== width || this.scaleFactor.height !== height){

            scaleManager.setGameSize(width, height);

            if(this.scaleFactor.scale !== scale) {
                scaleManager.setUserScale(scale, scale, 0, 0, force || false, force || false);
                this.scaleFactor.scale = scale
                console.log('y', scaleManager.game.camera.y)
            }

            this.scaleFactor.width = width
            this.scaleFactor.height = height

            if(callback) {
                callback(width, height)
            }
        }
    }

    goFullScreen(pointer, doubleTap) {
        if(doubleTap){
            if (this.game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
            }
            else {
                this.game.scale.startFullScreen(false);
            }
        }
    }

    handleIncorrect() {
        if (!this.game.device.desktop) {
            document.getElementById("turn").style.display = "block";
        }
    }

    handleCorrect() {
        if (!this.game.device.desktop) {
            document.getElementById("turn").style.display = "none";
        }
    }
}