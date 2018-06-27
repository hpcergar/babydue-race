import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import AssetProvider from '../providers/Asset'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])

    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
      this.game.attr.prefabs = this.game.attr.assetProvider.preloadSubassets();

  }

  create () {
    // TODO Undo, swap lines
    // this.state.start('MainMenu')
    this.state.start('Game')
  }
}
