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

        this.header = new Header(this.game, this.world)
        this.footer = new Footer(this.game, this.world)

        this.object = this.game.add.sprite(this.world.width - 64 - 525, this.game.camera.y, "aria-start-screen");
        // this.imageTest = this.game.add.image(this.world.centerX, this.world.centerY - this.game.height / 3, "mushroom");
        // this.imageTest.anchor.setTo(0.5);
        // scaleSprite(this.imageTest, this.game.width, this.game.height / 3, 50, 1);

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

    }

    resize(width, height) {
        this.header.redraw(this.game, this.world)
        this.footer.redraw(this.game, this.world)
        this.mainMenu.redraw(this.game, this.world)

        // TODO This is for test images
        scaleSprite(this.object, width, height / 3, 50, 1);
        this.object.x = this.world.centerX;
        this.object.y = this.world.centerY - height / 3;
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