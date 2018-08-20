class Menu {

	constructor(options, game, world){
		this.game = game;
		this.world = world;
		this.options = options;
		this.items = [];
		this.active = null;

		// Create an isActive property on each element
		this.options.items.forEach(function(navItem,index){
			navItem.isActive = false;
		});

		this.registerKeyhandler();

		this.drawMenu();

        // Set the first menu as active
        this.itemOnActive(this.items[0]);
		return this;
	}

	drawMenu() {
		let navigationOffset = this.getTopOffset();

		if (this.options.title) {
			let topOffset = navigationOffset - 40;
			let text = this.game.add.text(this.game.width/2, topOffset,this.options.title);
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = 'arcade';
		    text.fontSize = 25;
		    text.fill = '#455c3d';
    		text.strokeThickness = 0;

    		this.items.push(text);
		}

		this.options.items.forEach(function(navItem,index){
			let topOffset = navigationOffset + index*45;
            let text = this.game.add.text(this.game.width/2, topOffset,navItem.label);
            text.inputEnabled = true;
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = 'arcade';
		    text.fontSize = 50;
		    text.fill = '#455c3d';
		    text.stroke = '#504c39';
    		text.strokeThickness = 0;
    		text.index = index
			text.callback = navItem.callback
			text.events.onInputUp.add(text.callback)
    		text.events.onInputOver.add(_.bind(this.itemOnActive, this, text))

    		this.items.push(text);
		},this);
	}

	getTopOffset() {
		// TODO Calculate in function of world height
		return 200
	}

	redraw(game, world) {
		this.game = game
		this.world = world
        let navigationOffset = this.getTopOffset();
        this.items.forEach(function(item,index){
            item.position.x = this.game.width/2
			item.position.y = navigationOffset + index*45
        }, this)
	}

	itemOnActive(item) {
        if(this.items[this.active] != item && null != this.active){
            this.itemOnInactive(this.items[this.active])
		}
		item.isActive = true
        item.strokeThickness = 6
		this.active = item.index
	}

	itemOnInactive(item) {
        item.isActive = false
        item.strokeThickness = 0
	}

	getNextIndex() {
		let activeIndex = this.getActiveIndex();
		return (activeIndex == this.items.length-1) ? 0 : activeIndex+1;
	}

	getPrevIndex() {
		let activeIndex = this.getActiveIndex();
		return activeIndex == 0 ? this.items.length-1 : activeIndex-1;
	}

	getActiveIndex() {
		return this.active || 0;
	}

	moveCursor(newIndex) {
        this.itemOnActive(this.items[newIndex]);
	}

	registerKeyhandler() {
		this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.UP) {
	  			this.moveCursor(this.getPrevIndex());
			}
			if(e.keyCode == Phaser.Keyboard.DOWN) {
	  			this.moveCursor(this.getNextIndex());
			}
			if(e.keyCode == Phaser.Keyboard.ENTER) {
                this.items[this.getActiveIndex()].callback()
			}
		},this);
	}

	destroy() {
		this.game.input.keyboard.reset();
		this.items.forEach(function(navItem, index){
			navItem.destroy();
		});
	}

}

export default Menu;