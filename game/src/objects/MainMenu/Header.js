import config from '../../config'

class Header {

	constructor(game, world){
		this.game = game;
		this.world = world;
		this.items = [];
        this.fontScale = this.game.attr.heightScale || 1;
        this.heightScale = this.game.attr.heightScale || 1;

		this.draw();

		return this;
	}

	draw() {
        // Check this out
        let headerOffset = this.getTopOffset()

        this.items = []

        let babydueText = this.game.add.text(this.game.width*1/3, headerOffset,' Babydue ');
        babydueText.anchor.set(0.5);
        babydueText.align = 'center';
        babydueText.font = config.font.title.font;
        babydueText.fontSize = 140 * this.fontScale;
        babydueText.fill = '#ca869f';
        this.items.push(babydueText)

        // Add RACE text
        let babydueSubtext = this.game.add.text(this.game.width*1/3+3, headerOffset + (120 * this.heightScale),'    RACE ');
        babydueSubtext.anchor.set(0.5);
        babydueSubtext.align = 'center';
        babydueSubtext.font = config.font.title.font;
        babydueSubtext.fontSize = 260 * this.fontScale;
        babydueSubtext.fill = '#504c39';
        this.items.push(babydueSubtext)
	}

	getTopOffset() {
		// Calculate in function of world height
		return 100 * this.heightScale
	}

	getPosition(){
	    let item = this.items[0];
	    return [item.x, item.y, item.width, item.height]
    }

	destroy() {
		this.items.forEach(function(navItem, index){
			navItem.destroy();
		});
	}

}

export default Header;