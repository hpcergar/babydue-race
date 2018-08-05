
export default class {

    constructor (game) {
        // Starts
        this.game = game
		this.score = 0
    }

    create(){
        this.digitNumber = 7;
        this.topOffset = 20;
        this.rightOffset = 20;
        this.characterWidth = 25;

        this.label = this.game.add.text(this.game.width - (this.characterWidth * this.digitNumber) - this.rightOffset - 140, this.topOffset, 'Score');
        this.label.font = 'Press Start 2P';
        this.label.fontSize = 24;
        this.label.fill = '#cc4c28';
        this.label.fixedToCamera = true;

        this.scoretext = this.game.add.text(this.game.width - (this.characterWidth * this.digitNumber) - this.rightOffset, this.topOffset, '0');
        this.scoretext.font = 'Press Start 2P';
        this.scoretext.fontSize = 24;
        this.scoretext.fill = '#343537';
        this.scoretext.fixedToCamera = true;
    }

    add(points) {
    	this.score += points
	}

	get() {
    	return this.score
	}

    update() {
        let zeros = '' + Math.pow(10,this.digitNumber);
        let paddedScore = (zeros + this.score).substr(-this.digitNumber);
        this.scoretext.setText(paddedScore);
        this.scoretext.parent.bringToTop(this.scoretext)
	}
}