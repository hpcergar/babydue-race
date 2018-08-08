class Footer {

    constructor(game, world) {
        this.game = game;
        this.world = world;
        this.items = [];

        this.draw();

        return this;
    }

    draw() {

        let firstLine = "Copyright © 2018 - Paúl & Eli";
        let footerHeight = this.getHeight()

        let graphics = this.game.add.graphics(0, 0);
        this.drawRectangle(graphics)
        this.rectangle = graphics

        this.items = []


        let firstLineText = this.game.add.text(this.game.width / 2, this.game.world.height - footerHeight + 30, firstLine);
        firstLineText.anchor.set(0.5);
        firstLineText.align = 'center';
        firstLineText.font = 'arcade';
        firstLineText.fontSize = 20;
        firstLineText.fill = '#FFFFFF';
        firstLineText.strokeThickness = 0;

        this.items.push(firstLineText)
    }

    getHeight() {
        // TODO Calculate in function of world height
        return 60
    }

    drawRectangle(graphics) {
        let footerHeight = this.getHeight()
        graphics.beginFill(0xF99601);
        graphics.lineStyle(2, 0xF99601, 1);
        graphics.drawRect(0, this.game.world.height - footerHeight, this.game.width, footerHeight);
        graphics.endFill();
    }

    redraw(game, world) {
        this.game = game
        this.world = world
        this.drawRectangle(this.rectangle)
        let footerHeight = this.getHeight();
        this.items.forEach(function (item, index) {
            item.position.x = this.game.width / 2
            item.position.y = this.game.world.height - footerHeight + (index + 1) * 30
        }, this)
    }

    destroy() {
        this.items.forEach(function (navItem, index) {
            navItem.destroy();
        });
    }

}

export default Footer;