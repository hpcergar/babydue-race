import Menu from '../objects/MainMenu/Menu'
import Header from '../objects/MainMenu/Header'
import Footer from '../objects/MainMenu/Footer'
import _ from 'lodash'
import Config from "../config";
import {scaleSprite} from "../utils";

export default class extends Phaser.State {

    create() {
        // Set the game background colour
        this.game.stage.backgroundColor = Config.background.color;
        this.game.renderer.renderSession.roundPixels = true;
        this.fontScale = this.game.attr.heightScale || 1;

        this.header = new Header(this.game, this.world)
        this.footer = new Footer(this.game, this.world)

        this.object = this.game.add.sprite(this.world.width - (64) * this.fontScale, this.game.camera.y, "aria-start-screen");
        // this.imageTest = this.game.add.image(this.world.centerX, this.world.centerY - this.game.height / 3, "mushroom");
        // this.imageTest.anchor.setTo(0.5);
        scaleSprite(this.object, this.game.width, this.game.height * 4 / 5, 50, this.fontScale);


        console.log(this.game.width, this.game.height * 2 / 3)
        let mainMenuOptions = {
            'items' : [
                {
                    'label'    : this.game.translate('Play & Vote')
                    ,'callback': _.bind(this.startGame,this)
                }
                ,{
                    'label'    : 'High scores'
                    ,'callback': _.bind(this.showHighScores,this)
                }
                ,{
                    'label'    : 'See polls'
                    ,'callback': _.bind(this.showPolls,this)
                }
            ]
        }
        this.mainMenu = new Menu(mainMenuOptions, this.game, this.world);

        // Set image according to text block
        const [menuX, menuY, menuWidth, menuHeight] = this.header.getPosition()
        this.object.x =  menuX + (200) * this.fontScale
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