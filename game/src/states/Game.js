/* globals __DEV__ */
import Phaser from 'phaser'
import SAT from 'SAT'
import TilemapProvider from '../providers/Tilemap'
import DecorationProvider from '../providers/Decoration'
import Background from '../sprites/Background'
import Score from '../services/Score'
import Collectibles from '../sprites/Collectibles'
import Player from '../sprites/Player'
import Overlay from '../sprites/Overlay'

const BACKGROUND_LAYER = 'Background';
const BEHIND_LAYER = 'Behind';
const FRONT_LAYER = 'Foreground';

export default class extends Phaser.State {
    init() {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.stage.backgroundColor = '#000000'
        this.assetScale = 64;
        this.prefabs = this.game.attr.prefabs
        this.layers = []

        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
    }

    preload() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.score = new Score(this.game)

        //
        // Rendered layers
        //


        // Background
        this.layers[BACKGROUND_LAYER] = new Background(this.game, this.map)


        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        this.map = this.game.add.tilemap('level');

        this.layers[BEHIND_LAYER] = this.game.add.group()
        // ATTENTION! ORDER Matters for layer objects below!!!
        // Decoration: Background layer
        new DecorationProvider(this.map, 'Behind', this.layers[BEHIND_LAYER])

        // Ground
        this.tilemapProvider = new TilemapProvider(this.map, this.game);

        this.collectibles = new Collectibles(this.game, this.map, this.score)



        this.player = new Player(this.game)

        // Decoration: Foreground layer
        this.layers[FRONT_LAYER] = this.game.add.group()
        new DecorationProvider(this.map, 'Foreground', this.layers[FRONT_LAYER])

        this.mainLayer = this.tilemapProvider.getMainLayer()

        this.score.create();

        // Overlay, for transitions
        this.overlay = new Overlay(this.game)
        this.game.world.bringToTop(this.player.getObject());

        // Start transition
        let overlayFadeIn = this.game.add.tween(this.overlay.getObject()).to( { alpha: 0 }, 1000, "Linear");
        overlayFadeIn.onComplete.addOnce(() => {
            // TODO Kill here for performance?
            // this.overlay.getObject().kill()
            this.game.world.bringToTop(this.layers[FRONT_LAYER]);
        })
        overlayFadeIn.start();
    }

    create() {
    }

    render() {
    }

    update() {

        let hitGround = this.game.physics.arcade.collide(this.player.getObject(), this.mainLayer, this.isPlayerInSlope);

        this.collectibles.update(this.player.getObject())

        this.player.update(hitGround)
        this.layers[BACKGROUND_LAYER].update()
        this.score.update()
    }

    isPlayerInSlope(player, ground) {
        if (ground.slope && ground.slope.type > 0) {
            player.isOnSlope = ground.slope.type
        } else {
            player.isOnSlope = false
        }
    }
}
