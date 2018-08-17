
export default class {

    constructor (game, texts, callback = null) {
        // Starts
        this.game = game
        this.texts = texts
        this.callback = callback

        this.textsIndex = 0

        this.animationStarted = false
        this.waitingForUser = false

        this.wordTimer = null;
        this.pageTimer = null;

        this.fontScale = this.game.attr.widthScale || 1;
        this.heightScale = this.game.attr.heightScale || 1;

        this.line = [];
        this.wordIndex = 0;
        // Whole page content
        this.content = '';

        this.wordDelay = 120;
        this.pageDelay = 5000;
        // Text width block
        this.wordWrap = this.game.camera.width/2
    }

    start(){
        
        this.text = this.game.add.text( this.game.camera.width/2 - ((this.wordWrap)/2), this.game.camera.y + this.game.camera.height / 3, '');
        this.text.fill = '#FFFFFF';
        this.text.font = 'Press Start 2P';
        this.text.fontSize = 14 * this.fontScale;
        this.text.wordWrap = true;
        this.text.wordWrapWidth = this.wordWrap;

        this.nextPage();
    }

    update(input = false) {

        // Handle user input
        if(!input) return;

        this.waitingForUser ? this.nextPage() : this.fullPage()
	}



    nextPage() {
        this.waitingForUser = false
        console.log('Texts index' + this.textsIndex);
        if (this.textsIndex === this.texts.length)
        {
            //  We're finished
            this.callback();
            return;
        }

        this.content = this.texts[this.textsIndex]
        //  Split the current line on spaces, so one word per array element
        this.line = this.content.split(' ');

        this.text.text = '';

        //  Reset the word index to zero (the first word in the line)
        this.wordIndex = 0;

        //  Call the 'nextWord' function once for each word in the line (line.length)
        this.wordTimer = this.game.time.events.repeat(this.wordDelay, this.line.length, this.nextWord, this);

    }

    nextWord() {

        //  Add the next word onto the text string, followed by a space
        this.text.text = this.text.text.concat(this.line[this.wordIndex] + " ");

        //  Advance the word index to the next word in the line
        this.wordIndex++;

        //  Last word?
        if (this.wordIndex === this.line.length)
        {
            this.endPage()
        }
    }
    
    endPage() {
        this.game.time.events.remove(this.wordTimer);
        this.textsIndex++;
        this.waitingForUser = true
    }
    
    fullPage() {
        this.text.text = this.content;
        this.endPage()
    }
}