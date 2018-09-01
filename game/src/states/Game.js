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
import Scale from "../services/Scale";

// import DebugArcadePhysics from 'DebugArcadePhysics'

const BACKGROUND_LAYER = 'Background';
const BEHIND_LAYER = 'Behind';
const MECHANICS_LAYER = 'Mechanics';
const FRONT_LAYER = 'Foreground';

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

        this.scaleService = new Scale()
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.align(true, true);
        this.scale.setResizeCallback(this.onResize, this);
        this.scale.refresh();

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

        // Collectibles (coins, stars)
        this.collectibles = new Collectibles(this.game, this.map, this.score)

        // Player (Aria)
        this.player = new Player(this.game)

        // Decoration: Foreground layer
        this.layers[FRONT_LAYER] = this.game.add.group()
        new DecorationProvider(this.map, 'Foreground', this.layers[FRONT_LAYER])

        this.mainLayer = this.tilemapProvider.getMainLayer()

        this.score.hide()

        // Overlay, for transitions
        this.overlay = new Overlay(this.game)

        this.game.world.bringToTop(this.player.getObject());

        // Start transition
        // Force update user scale
        this.onResize(this.game.scale, new Phaser.Rectangle(0, 0, this.game.width, this.game.height), true)
        this.overlay.fade(1000, () => {
            this.score.show()
            this.game.world.bringToTop(this.layers[FRONT_LAYER])
            this.startBeginTransition()
        })
    }

    /**
     *
     * @param scaleManager
     * @param parentBounds
     * @param force
     */
    onResize(scaleManager, parentBounds, force = false) {
        this.scaleService.resize(scaleManager, parentBounds, force, (width, height) => {
            console.log('scaled up (width, height)')
            let layersMap = this.tilemapProvider.getLayers()
            layersMap['Ground'].resize(width, height)
            layersMap['Ground background'].resize(width, height)

            this.overlay.resize()
            this.mainLayer.resizeWorld()
            this.score.redraw()
        })
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

    /**
     *
     */
    startBeginTransition() {
        this.countDownNumber(3, () =>
            this.countDownNumber(2, () =>
                this.countDownNumber(1, () =>
                    this.countDownNumber(this.game.translate('Despegue'), () => {
                        this.player.run()
                }))))
    }

    /**
     *
     * @param number
     * @param callback
     */
    countDownNumber(number, callback) {
        let numberText = this.game.add.text(this.game.width/2 - 15, this.game.height/2 - 15, number);
        numberText.font = 'Press Start 2P';
        numberText.fontSize = 30;
        numberText.fill = '#cc4c28';
        numberText.fixedToCamera = true;
        numberText.alpha = 0;

        this.add.tween(numberText).to({ alpha: 1}, 500, Phaser.Easing.Back.Out, true);
        let scaleTweenIn = this.add.tween(numberText.scale).to({ x: 2, y: 2}, 500, Phaser.Easing.Back.Out)
        scaleTweenIn.onComplete.addOnce(() => {
            setTimeout(() => {
                // this.add.tween(numberText).to({ alpha: 0}, 500, Phaser.Easing.Back.Out, true);
                // let scaleTweenOut = this.add.tween(numberText.scale).to({ x: 4, y: 4}, 500, Phaser.Easing.Back.Out)
                let scaleTweenOut = this.add.tween(numberText).to({ width: numberText.width*3, height: numberText.height*3, alpha: 0}, 300, 'Linear')
                scaleTweenOut.onComplete.addOnce(() => {
                    numberText.kill();
                    callback()
                })
                scaleTweenOut.start();
            }, 500)
        })
        scaleTweenIn.start();
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
        this.overlay.fade(1000, () => {
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
                        this.overlay.fade(1000, () => this.startDoorTransition(), 0)
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

}
