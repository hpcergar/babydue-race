import HighscoresService from '../services/HighscoresService';
import ScoreService from '../services/Score';
import Input from '../services/Input'
import Config from '../config'

export default class extends Phaser.State {

	create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

        this.input = new Input(this.game)

		// Set the game background colour
		this.game.stage.backgroundColor = Config.background.color;
        this.fontScale = this.game.attr.widthScale || 1;
        this.heightScale = this.game.attr.heightScale || 1;
		this.createHeader();


		// this.font = 'arcade';
		this.font = 'Press Start 2P';


		this.loadingText = this.game.add.text(this.game.width/2, 200, this.game.translate('Loading...'));
	    this.loadingText.anchor.set(0.5);
        this.loadingText.font = this.font
	    this.loadingText.fontSize = 40 * this.fontScale;
	    this.loadingText.fill = '#504c39';	   

	    this.scoreService = new ScoreService();
        this.highscoresService = new HighscoresService();
		let results = this.highscoresService.getTop10();
		this.renderHighScores(results);
	}

	update() {
        if (this.input.isDown()) {
            this.game.state.start('MainMenu');
        }
	}

	createHeader() {
		let headerOffset = 80 * this.heightScale;

		let text = this.game.add.text(this.game.width/2, headerOffset,'High Scores');
	    text.anchor.set(0.5);
	    text.align = 'center';
	    text.font = this.font
	    text.fontSize = 20 * this.fontScale;
	    text.fill = '#FFFFFF';
	    text.stroke = '#504c39';
   		text.strokeThickness = 3 * this.fontScale;
	}

	renderHighScores(toplist) {
		this.loadingText.destroy();
		
		let topListOffset = 90 * this.heightScale;
		let text = '';
		_.each(toplist,_.bind((item,index) => {
			let value = (index+1)+'. ' + this.scoreService.pad(item.score) + "\t" + item.name;
            text += "\n" + value;
		}));

		let highscores = this.game.add.text(this.game.width/2, topListOffset, text,
            {
                // font: '40px ' + this.font, // for arcade
                // font: '30px ' + this.font,
                font: (14 * this.fontScale) + 'px ' + this.font,
                fill: '#504c39',
                align: 'left'
            }
        );

        highscores.lineSpacing = 10 * this.heightScale; // so it will move with camera
        highscores.fixedToCamera = true; // so it will move with camera
        highscores.anchor.setTo(0.5, 0);
	}
}
