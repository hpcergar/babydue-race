import Menu from '../objects/MainMenu/Menu'
import Header from '../objects/MainMenu/Header'
import Footer from '../objects/MainMenu/Footer'
import _ from 'lodash'
import Config from "../config";
import {scaleSprite} from "../utils";
import HighscoresService from "../services/HighscoresService";

export default class extends Phaser.State {

    preload() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // Set the game background colour
        this.game.stage.backgroundColor = Config.background.color;
        this.game.renderer.renderSession.roundPixels = true;
        this.fontScale = this.game.attr.heightScale || 1;

        this.highscoresService = new HighscoresService()
        let canVote = !!this.highscoresService.getUserScore()

        this.header = new Header(this.game, this.world)
        this.footer = new Footer(this.game, this.world)

        this.object = this.game.add.sprite(this.camera.width - (64) * this.fontScale, this.game.camera.y, "aria-start-screen");
        scaleSprite(this.object, this.game.width, this.game.height * 4 / 5, 50, this.fontScale);


        console.log(this.game.width, this.game.height * 2 / 3)
        console.log(this.game.attr.heightScale)
        let mainMenuOptions = {
            'items' : [
                {
                    'label'    : this.game.translate('Play & Vote')
                    ,'callback': _.bind(this.startGame,this)
                }
                ,{
                    'label'    : this.game.translate('High scores')
                    ,'callback': _.bind(this.showHighScores,this)
                }
            ]
        }

        // Add link to votes if can vote (has already played once)
        if(canVote) {
            mainMenuOptions.items.push({
                'label'    : this.game.translate('See polls')
                ,'callback': _.bind(this.showPolls,this)
            })
        }

        this.mainMenu = new Menu(mainMenuOptions, this.game, this.world);


    }

    create() {
        // // Set image according to text block
        const [menuX, menuY, menuWidth, menuHeight] = this.header.getPosition()
        this.object.x =  menuX + (350) * this.fontScale
        this.object.y =  menuY
    }


    startGame() {
        this.state.start('GameStartTransition')
    }

    showHighScores() {
        this.state.start('HighScores')
    }

    showPolls() {
        this.state.start('Polls')
    }
}