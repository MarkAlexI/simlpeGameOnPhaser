'use strict';

let gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
  this.playerSpeed = 1;
};

gameScene.preload = function() {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('treasure', 'assets/treasure.png');
};

gameScene.create = function() {
  let bg = this.add.sprite(0, 0, 'background');
  bg.setOrigin(0, 0);
  
  this.player = this.add.sprite(40, this.sys.game.config.height/2, 'player');
  this.player.setScale(.5);
  
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height/2, 'treasure');
  this.treasure.setScale(.8);
};

gameScene.update = function() {
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }
};

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

let game = new Phaser.Game(config);