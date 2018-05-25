import Menu from '../objects/Menu'
import _ from 'lodash'
import Config from "../config";

export default class extends Phaser.State {

    create() {
        // Set the game background colour
        this.game.stage.backgroundColor = Config.background.color;
        this.game.renderer.renderSession.roundPixels = true;

        this.createHeader()
        this.createFooter()

        let mainMenuOptions = {
            'items' : [
                {
                    'label'    : 'Play & Vote'
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
        this.mainMenu = new Menu(mainMenuOptions,this.game);
    }

    startGame() {
        this.state.start('Game')
    }

    showHighScores() {
        this.state.start('HighScores')
    }

    showPolls() {
        this.state.start('Polls')
    }

    createHeader() {
        // TODO check this out
        let headerOffset = 80;

        var babydueText = this.game.add.text(this.game.width/2, headerOffset,'Babydue');
        babydueText.anchor.set(0.5);
        babydueText.align = 'center';
        babydueText.font = 'arcade';
        babydueText.fontSize = 50;
        babydueText.fill = '#333023';

        // Add RUN text
        babydueText = this.game.add.text(this.game.width/2+3, headerOffset + 35,'RACE');
        babydueText.anchor.set(0.5);
        babydueText.align = 'center';
        babydueText.font = 'arcade';
        babydueText.fontSize = 120;
        babydueText.fill = '#504c39';
    }

    createFooter() {

        var firstLine = "Copyright © 2018 - Paúl & Eli";
        var footerHeight = 80;

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0xF99601);
        graphics.lineStyle(2, 0xF99601, 1);
        graphics.drawRect(0, this.game.world.height-footerHeight, this.game.width, footerHeight);
        graphics.endFill();


        var firstLineText = this.game.add.text(this.game.width/2, this.game.world.height-footerHeight+30,firstLine);
        firstLineText.anchor.set(0.5);
        firstLineText.align = 'center';
        firstLineText.font = 'arcade';
        firstLineText.fontSize = 20;
        firstLineText.fill = '#FFFFFF';
        firstLineText.strokeThickness = 0;
    }
}