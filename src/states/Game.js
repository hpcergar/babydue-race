/* globals __DEV__ */
import Phaser from 'phaser'
import SAT from 'SAT'
import TilemapProvider from '../providers/Tilemap'
import GroupProvider from '../providers/Groups'
import Stars from '../sprites/Stars'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init() {
      // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      this.stage.backgroundColor = '#000000'
      this.assetScale = 64;
      this.prefabs = this.game.attr.prefabs

      this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
  }
  preload() {

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.stage.backgroundColor = '#787878';

      //Add the tilemap and tileset image. The first parameter in addTilesetImage
      //is the name you gave the tilesheet when importing it into Tiled, the second
      //is the key to the asset in Phaser
      this.map = this.game.add.tilemap('level');
      this.tilemapProvider = new TilemapProvider(this.map, this.game);
      // this.groupProvider = new GroupProvider(this.game);
      this.stars = new Stars(this.game, this.map)
      this.player = new Player(this.game)
      this.mainLayer = this.tilemapProvider.getMainLayer()
  }

  create() {

      // Decoration objects
      // TODO Load other objects
      // TODO Refactor this out of here
      this.map.createFromObjects('Behind', 'Scarecrow', 'autumn-objects', 20, true, false, this.behindObjectLayer);

  }



  render() {
  }

  update() {

      let hitGround = this.game.physics.arcade.collide(this.player.getObject(), this.mainLayer, this.isPlayerInSlope);

      this.stars.update(this.player.getObject())

      this.player.update(hitGround)
  }

  isPlayerInSlope(player, ground){
      if(ground.slope && ground.slope.type > 0){
          player.isOnSlope = ground.slope.type
      } else {
          player.isOnSlope = false
      }
  }
}
