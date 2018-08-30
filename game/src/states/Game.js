/* globals __DEV__ */
import Phaser from 'phaser'
import SAT from 'SAT'
import TilemapProvider from '../providers/Tilemap'
import DecorationProvider from '../providers/Decoration'
import Background from '../sprites/Background'
import Score from '../services/Score'
import Collectibles from '../sprites/Collectibles'
import Player from '../sprites/Player'
import Door from '../sprites/Door'
import Overlay from '../sprites/Overlay'
import HighscoresService from '../services/HighscoresService'
import TextPanel from "../services/TextPanel";

// import DebugArcadePhysics from 'DebugArcadePhysics'

const BACKGROUND_LAYER = 'Background';
const BEHIND_LAYER = 'Behind';
const MECHANICS_LAYER = 'Mechanics';
const FRONT_LAYER = 'Foreground';

const MIN_WIDTH = 1350
const MIN_HEIGHT = 900

export default class extends Phaser.State {
    init() {

        this.stage.backgroundColor = '#000000'
        this.assetScale = 64;
        this.prefabs = this.game.attr.prefabs
        this.layers = []

        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);

        // debug
        // this.game.plugins.add(Phaser.Plugin.DebugArcadePhysics);
        // this.game.debug.arcade.on()
    }

    preload() {

        // TODO Undo?
        // this.scale.scaleMode = Phaser.ScaleManager.RESIZE
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.align(true, true);
        this.scale.setResizeCallback(this.onResize, this);
        this.scale.refresh();

        // this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        // console.log('window', window.innerWidth, window.innerHeight)
        // console.log('camera', this.game.camera)
        // console.log('game', this.game.width, this.game.height)
        // console.log('game world', this.game.world.width, this.game.world.height)

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // STATE
        // Score
        this.score = new Score(this.game)
        this.highscoresService = new HighscoresService()
        this.textPanel = {}
        this.door = new Door(this.game)

        // State flags
        this.isEndAnimation = false

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

        // Mechanics (slow-down, jump)
        new DecorationProvider(this.map, 'Mechanics', this.layers[MECHANICS_LAYER])

        this.collectibles = new Collectibles(this.game, this.map, this.score)


        this.player = new Player(this.game)

        // let scale = 0.7
        // this.game.renderer.resize(this.game.renderer.width * scale, this.game.renderer.height * scale)

        // Decoration: Foreground layer
        this.layers[FRONT_LAYER] = this.game.add.group()
        new DecorationProvider(this.map, 'Foreground', this.layers[FRONT_LAYER])

        this.mainLayer = this.tilemapProvider.getMainLayer()

        this.score.create();

        // Overlay, for transitions
        this.overlay = new Overlay(this.game)
        this.game.world.bringToTop(this.player.getObject());

        // Start transition
        this.overlayFade(1000, () => this.game.world.bringToTop(this.layers[FRONT_LAYER]))
    }

    onResize(scaleManager, parentBounds) {
        // console.log('onResize', parentBounds.width, parentBounds.height);
        //
        // let scaleX = parentBounds.width / MAX_WIDTH;
        // let scaleY = parentBounds.height / MAX_HEIGHT;
        let scaleX = parentBounds.width / MIN_WIDTH;
        let scaleY = parentBounds.height / MIN_HEIGHT;
        let scale = Math.max(0.6, Math.max(scaleX, scaleY));
        let width = ~~Math.min(parentBounds.width / scale, MIN_WIDTH);
        let height = ~~Math.min(parentBounds.height / scale, MIN_HEIGHT);

        let layersMap = this.tilemapProvider.getLayers()
        layersMap['Ground'].resize(width, height)
        layersMap['Ninja-tiles'].resize(width, height)
        layersMap['Ground background'].resize(width, height)

        // console.log('game size', width, height, scale)
        scaleManager.setGameSize(width, height);
        scaleManager.setUserScale(scale, scale, 0, 0, false, false);


        this.mainLayer.resizeWorld()
        this.score.redraw()
    }


    update() {

        let hitGround = this.game.physics.arcade.collide(this.player.getObject(), this.mainLayer, (player, ground) => this.player.setCollisionData(ground));

        if (!this.isEndAnimation) {
            this.collectibles.update(this.player.getObject())
            this.player.update(hitGround)
            this.score.update()
        }

        this.layers[BACKGROUND_LAYER].update()

        // End game
        if (this.player.isPlayable && this.player.isBeyondEndPoint()) {
            this.startEndAnimation()
        }
    }

    startEndAnimation() {
        this.isEndAnimation = true
        this.player.startEndAnimation()

        // Render door
        this.door.render()

        // let playerObject = this.player.getObject()
        this.game.world.bringToTop(this.overlay.getObject());
        this.game.world.bringToTop(this.player.getObject());
        let score = this.score.get()

        // Push new score to API
        let bestScore = this.highscoresService.getUserScore()
        let position = this.highscoresService.getScorePosition(score)
        if (score > bestScore) {
            this.highscoresService.saveScore(score);
        }

        // Score text & position if <= 10th
        let text = this.getEndText(score, position, bestScore)


        // Start transition
        // Display overlay
        this.overlayFade(1000, () => {
            let playerObject = this.player.getObject()
            // Move camera to have user on the left
            this.game.camera.follow(null);
            playerObject.body.velocity.x = 0;
            let moveCameraToRight = this.game.add.tween(this.game.camera).to({
                x: playerObject.body.x - 70,
                y: this.game.camera.y
            }, 750, Phaser.Easing.Quadratic.InOut);

            // Create door
            this.door.moveToPosition()

            moveCameraToRight.onComplete.addOnce(() => {

                // Display end message with score & position
                this.textPanel = new TextPanel(this.game, text, () => {
                    let moveCameraToRight = this.game.add.tween(this.game.camera).to({
                        x: this.game.world.x / 2 + playerObject.body.width / 2,
                        y: this.game.camera.y
                    }, 750, Phaser.Easing.Quadratic.InOut);
                    moveCameraToRight.onComplete.addOnce(() => {
                        this.game.camera.follow(playerObject);
                        this.overlayFade(1000, () => this.startDoorTransition(), 0)
                    })
                    moveCameraToRight.start();

                }, {
                    offsetX: this.game.camera.x,
                    destroyOnComplete: true
                })
                this.textPanel.start()
            })
            moveCameraToRight.start();

        }, 1)

    }

    startDoorTransition() {
        // Not need
        // this.game.world.bringToTop(this.layers[FRONT_LAYER]);

        // Stop player in front of the door
        this.player.goToPoint('playerInFrontOfDoor', () => {
            this.game.camera.follow(null)
            // Door animation
            this.door.open();

            setTimeout(() => {
                // Pass player through the door
                this.player.goToPoint('playerAfterDoor', () => {
                    // Camera flash & go to state
                    this.camera.fade('#000000');
                    this.state.start('Polls')
                })

            }, 1000)
        })
    }


    /**
     * Calculate text after having finished level
     * @param score
     * @param position
     * @param bestScore
     * @returns {*[]}
     */
    getEndText(score, position, bestScore) {
        let text = this.game.translate('Congratulations').replace(':score', score),
            isBestScore = score >= bestScore
        ;

        if (false !== position && isBestScore) {
            text = text.concat("\n" + this.game.translate("You are in the top 10").replace(':position', position))
        }

        if (!isBestScore) {
            text = text.concat("\n\n" + this.game.translate("Your best score is").replace(':score', bestScore))
        }

        return [text]; // As single page, you could add multiple for each displayed page
    }

    /**
     *
     * @param duration
     * @param callback
     * @param alpha
     */
    overlayFade(duration, callback, alpha = 0) {
        let overlay = this.overlay.getObject()
        overlay.position.x = this.game.camera.x
        overlay.position.y = this.game.camera.y
        console.log('overlay position', overlay.position.x, overlay.position.y, overlay.width, overlay.height)
        console.log('camera', this.game.camera.x, this.game.camera.y, this.game.camera.width, this.game.camera.height)
        // this.overlay.resize()
        let overlayFadeIn = this.game.add.tween(overlay).to({alpha: alpha}, duration, "Linear");
        overlayFadeIn.onComplete.addOnce(callback)
        overlayFadeIn.start();
    }
}
