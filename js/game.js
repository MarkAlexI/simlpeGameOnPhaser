'use strict';

let loadScene = new Phaser.Scene('Load');
let gameScene = new Phaser.Scene('Game');

loadScene.create = function() {
  this.add.text(100, this.sys.game.config.height/2, 'Loading...', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '48px' });
};

loadScene.update = function() {
  this.time.delayedCall(5000, function() {
    this.scene.start('Game');
  }, [], this);
};

gameScene.init = function() {
  this.playerSpeed = 1;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
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
  
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
  
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = Math.random() * 2 + 1;
  }, this);
  
  this.isPlayerAlive = true;
  
  this.cameras.main.resetFX();
  
  this.timeInSeconds = 30;

  this.timeText = this.add.text(230, 30, "0", {
    font: '30px Arial',
    fill: '#FFFFFF',
    align: 'center'
  });
  this.timeText.scrollFactorX = 0;
  this.timedEvent = this.time.delayedCall(this.timeInSeconds * 1000, this.onEvent, [], this);
};

gameScene.onEvent = function() {
  this.gameOver();
};

gameScene.update = function() {
  if (!this.isPlayerAlive) return;
  
  if  (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameOver();
  }
  
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }
  
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;
  for (let i = 0; i < numEnemies; i++) {
    enemies[i].y += enemies[i].speed;
    
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }
    
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
  
  const elapsedTime = this.timeInSeconds - this.timeInSeconds * this.timedEvent.getProgress();
  this.timeText.setText(`Time: ${elapsedTime.toString().substr(0, elapsedTime < 10 ? 3 : 2)}`);
};

gameScene.gameOver = function() {
  this.isPlayerAlive = false;
  
  this.cameras.main.shake(500);
  
  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);
  
  this.time.delayedCall(500, function() {
    this.scene.restart();
  }, [], this);
};

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: [loadScene, gameScene]
};

let game = new Phaser.Game(config);