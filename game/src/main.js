import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import MainMenuState from './states/MainMenu'
import GameState from './states/Game'
import HighScoresState from './states/HighScores'
import PollsState from './states/Polls'
import {calculateAttr} from './utils'

import config from './config'

class Game extends Phaser.Game {
    constructor() {

        let attr = calculateAttr(config.resolutions);

        super(attr.width, attr.height, Phaser.CANVAS)

        this.attr = attr


        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('MainMenu', MainMenuState, false)
        this.state.add('Game', GameState, false)
        this.state.add('HighScores', HighScoresState, false)
        this.state.add('Polls', PollsState, false)

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        this.state.start('Boot')
    }


    // updateRealSize(width, height) {
    //     this.realWidth = Math.max(width, height);
    //     this.realHeight = Math.min(width, height);
    // }
    //
    // updateAssetScale(width, height) {
    //     this.assetScale = 1;
    //     if (width > config.gameWidth || height > config.gameHeight) {
    //         this.assetScale = 2;
    //     }
    // }
    //
    // updateScaleRatio() {
    //     this.updateRealSize(window.innerWidth, window.innerHeight)
    //     let ws = this.realWidth / (config.gameWidth * this.assetScale);
    //     let wh = this.realHeight / (config.gameHeight * this.assetScale);
    //     this.scaleRatio = Math.max(ws, wh);
    // }
}

window.game = new Game()
