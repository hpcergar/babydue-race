/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init() {
      // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      this.stage.backgroundColor = '#000000'
      this.assetScale = 64;
      this.prefabs = this.game.attr.prefabs
  }
  preload() {


      // this.game.load.spritesheet('player', 'assets/sprites/mario-sprites.png', 16, 32);
      // this.game.load.tilemap('tilemap', 'assets/tilemaps/' + this.assetScale + '/autumn/autumn.json', null, Phaser.Tilemap.TILED_JSON);
      // this.game.load.image('autumn', 'assets/tilemaps/' + this.assetScale + '/autumn/autumn.png');
      // this.game.load.spritesheet('autumn-objects', 'assets/tilemaps/' + this.assetScale + '/autumn/objects.png', 64, 64);

  }

  create() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.stage.backgroundColor = '#787878';

      //Add the tilemap and tileset image. The first parameter in addTilesetImage
      //is the name you gave the tilesheet when importing it into Tiled, the second
      //is the key to the asset in Phaser
      this.map = this.game.add.tilemap('level');
      this.map.addTilesetImage('autumn', 'autumn');

      //Add both the background and ground layers. We won't be doing anything with the
      //GroundLayer though
      this.backgroundlayer = this.map.createLayer('Background');

      // Starts
      this.stars = this.game.add.physicsGroup();
      this.map.createFromObjects('Coins', 'Star', 'autumn-objects', 39, true, false, this.stars);
      this.map.createFromObjects('Behind', 'Scarecrow', 'autumn-objects', 20, true, false, this.behindObjectLayer);


      this.stars.forEach(function(star){
          star.body.immovable = true
      })

      this.groundLayer = this.map.createLayer('Ground');

      //Before you can use the collide function you need to set what tiles can collide
      this.map.setCollisionBetween(1, 100, true, 'Ground');

      //Add the sprite to the game and enable arcade physics on it
      this.player = this.game.add.sprite(32, 32, 'player');
      this.game.physics.arcade.enable(this.player);

      //Change the world size to match the size of this layer
      this.groundLayer.resizeWorld();


      this.player.body.bounce.y = 0.2;
      this.player.body.linearDamping = 1;
      this.player.body.collideWorldBounds = true;
      this.player.body.gravity.y = 250;
      // this.game.physics.arcade.gravity.y = 250;

      this.player.animations.add('right', [0,1,2], 10, true)
      this.player.animations.play('right')

      //Make the camera follow the sprite
      this.game.camera.follow(this.player);

      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.lookingRight = true;
  }

  // TODO Remove
  starCollect(player, star) {
      star.kill();
  }

  render() {
  }

  update() {
      this.game.physics.arcade.collide(this.player, this.groundLayer);

      // inside update() function
      this.game.physics.arcade.overlap(this.player, this.stars, this.starCollect, null, this);

      this.player.body.velocity.x = 0;

      if (this.cursors.up.isDown)
      {
          if (this.player.body.onFloor())
          {
              this.player.body.velocity.y = -200;
          }
      }

      if (this.cursors.left.isDown)
      {
          if(this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = false;}
          this.player.body.velocity.x = -150;
      }
      else if (this.cursors.right.isDown)
      {
          if(!this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = true;}
          this.player.body.velocity.x = 150;

      }
  }
}
