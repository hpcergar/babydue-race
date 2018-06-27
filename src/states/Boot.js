import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'
import MapProvider from '../providers/Map'


export default class extends Phaser.State {
    init() {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE
        this.stage.backgroundColor = '#000000'
        this.fontsReady = false
        this.fontsLoaded = this.fontsLoaded.bind(this)
    }

    preload() {
        if (config.webfonts.length) {
            WebFont.load({
                google: {
                    families: config.webfonts
                },
                active: this.fontsLoaded
            })
        }

        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
        text.anchor.setTo(0.5, 0.5)

        this.mapProvider = new MapProvider(this.game, config.scales.default, config.assets.prefixes)
    }

    create() {
        this.game.attr.prefabs = this.mapProvider.create();
    }

    render() {
        if ((config.webfonts.length && this.fontsReady) || !config.webfonts.length) {
            this.state.start('Splash')
        }
    }

    fontsLoaded() {
        this.fontsReady = true
    }
}