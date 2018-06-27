class Header {

	constructor(game, world){
		this.game = game;
		this.world = world;
		this.items = [];

		this.draw();

		return this;
	}

	draw() {
        // TODO check this out
        let headerOffset = this.getTopOffset()

        this.items = []

        let babydueText = this.game.add.text(this.game.width/2, headerOffset,'Babydue');
        babydueText.anchor.set(0.5);
        babydueText.align = 'center';
        babydueText.font = 'arcade';
        babydueText.fontSize = 50;
        babydueText.fill = '#333023';
        this.items.push(babydueText)

        // Add RACE text
        let babydueSubtext = this.game.add.text(this.game.width/2+3, headerOffset + 60,'RACE');
        babydueSubtext.anchor.set(0.5);
        babydueSubtext.align = 'center';
        babydueSubtext.font = 'arcade';
        babydueSubtext.fontSize = 90;
        babydueSubtext.fill = '#504c39';
        this.items.push(babydueSubtext)
	}

	getTopOffset() {
		// TODO Calculate in function of world height
		return 60
	}

	redraw(game, world) {
		this.game = game
		this.world = world
        let headerOffset = this.getTopOffset();
        this.items.forEach(function(item,index){
            item.position.x = this.game.width/2
			item.position.y = headerOffset + index*60
        }, this)
	}

	destroy() {
		this.items.forEach(function(navItem, index){
			navItem.destroy();
		});
	}

}

export default Header;