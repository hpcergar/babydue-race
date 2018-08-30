
export default class {

    constructor (game) {
        // Starts
        this.game = game
		this.score = 0
        this.digitNumber = 7;
    }

    create(){
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

	redraw() {
        this.label.kill()
        this.scoretext.kill()
        this.create()
        this.update()
    }

    /**
     * Left pad with zeros
     * @param score
     * @returns {string}
     */
	pad(score) {
        let zeros = '' + Math.pow(10,this.digitNumber);
        return (zeros + score).substr(-this.digitNumber);
    }

    update() {
        this.scoretext.setText(this.pad(this.score));
        this.scoretext.parent.bringToTop(this.scoretext)
	}
}