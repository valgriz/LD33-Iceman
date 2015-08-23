var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

//groups
var gIceBlockBorder;
var gIceBlockEnvironment;
var gFire

//visible objects
var monster;
var fire;
var liquid;

//animations
var flame;
var monsterAnimation;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;
var spaceBar;

//variables
var logicTimer;
var temperature;
var gameEnded;

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

function preload(){

	game.load.image('bgd_base','assets/images/bgd_base.png');
	game.load.image('wall','assets/images/wall_a1.png');
	game.load.image('monster','assets/images/monster_a1.png');
	game.load.image('therm_base','assets/images/therm_base.png');
	game.load.image('therm_liquid','assets/images/therm_liquid.png');

	game.load.spritesheet('fire', 'assets/images/fire_a1.png', 64, 64, 4);
	game.load.spritesheet('monsterSpriteSheet', 'assets/images/monstersheet_a1.png', 41, 64, 16);


	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function create(){

	game.add.sprite(0, 0, 'bgd_base');

	//monster = game.add.sprite(600, 100, 'monster');
	monster = game.add.sprite(832, 560 - ((1 + 1) * 64),'monsterSpriteSheet');
	monster.animations.add('idle', [0,1,2,3], 10, true);
	monster.animations.add('rMotion', [4,5,6,7,8,9], 10, true);
	monster.animations.add('lMotion', [10,11,12,13,14,15], 10, true);	
	monster.animations.play('idle');

	gIceBlockBorder = new Phaser.Group(game)
	gIceBlockEnvironment = new Phaser.Group(game);
	gFire = new Phaser.Group(game);

	logicTimer = 250;
	temperature = 0;

	for(var i = 0; i < 14; i++){
		gIceBlockBorder.add(game.add.sprite((i * 64), 560 - (1 * 64), 'wall'));
	}


	game.physics.enable([monster, gIceBlockBorder], Phaser.Physics.ARCADE);
	monster.body.gravity.y = 1400;
	gIceBlockBorder.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
	    sp.body.immovable = true;
	}, this);


	liquid = game.add.sprite(59, 35, 'therm_liquid');
	game.add.sprite(25, 25, 'therm_base');
	
	liquid.scale.x = (temperature/100);

	gameEnded = false;

}


function spawnFlame(){
	var tempFire = game.add.sprite(832, 560 - ((1 + 1) * 64),'fire');
	tempFire.animations.add('flame', [0,1,2,3], 10, true);
	tempFire.animations.play('flame');

	gFire.add(tempFire);

	game.physics.enable([gFire], Phaser.Physics.ARCADE);
	gFire.forEach(function(ds){
					ds.body.velocity.x = -100 * (logicTimer / 250);
			   		ds.body.immovable = true;
				}, this);
			}

function spawnEnvironmentBlock(height){
	gIceBlockEnvironment.add(game.add.sprite(832,  560 - ((height + 1) * 64), 'wall'));
	game.physics.enable([gIceBlockEnvironment], Phaser.Physics.ARCADE);
	gIceBlockEnvironment.forEach(function(ds){
					ds.body.velocity.x = -100 * (logicTimer / 250);
			   		ds.body.immovable = true;
				}, this);
			var rnd = Math.random();
				if(rnd < (1/(height + 1))){
				spawnEnvironmentBlock(height + 1);
			}
}

function removeElements(arrayOfElementsToRemove){
	for(var i = 0; i < arrayOfElementsToRemove.length; i++){
		gIceBlockEnvironment.remove(arrayOfElementsToRemove[i]);
	}
}

function gameOver(){
	alert('GAME OVER!!!\nThanks for playing!');
	gameEnded = true;
}

function monsterFireCollide(){
	if(temperature<100){
		temperature++;
	} else {
		if(!gameEnded){
			gameOver();
		}
	}
}


function update(){

	var remEle = [];

	gIceBlockEnvironment.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
		if(sp.body.x <= -64){
				sp.body.x = 100;
				sp.body.y = 100;
				remEle.push(sp);
		}
	}, this);

	gFire.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
		//game.physics.arcade.collide(monster, sp, monsterFireCollide, null, this);
		if((monster.body.x + 41 > sp.body.x) && (monster.body.x < sp.body.x + 64 )){
			if((monster.body.y + 41 > sp.body.y) && (monster.body.y < sp.body.y + 64)){
			monsterFireCollide();
			}
		}
	}, this);

	gIceBlockBorder.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
		if(sp.body.x <= -64){
			sp.body.x = 832;
			logicTimer++;
			var rnd = Math.random();
			if(rnd < .6){
				spawnEnvironmentBlock(1);
			} else {
				spawnFlame();				
			}

		}
	}, this);

	liquid.scale.x = (temperature/100);


	removeElements(remEle);

	game.physics.arcade.collide(monster, gIceBlockBorder);
	game.physics.arcade.collide(monster, gIceBlockEnvironment);




	if(leftKey.isDown || aKey.isDown){
		monster.body.velocity.x = -270;
		monster.animations.play('lMotion');

 	} else if(rightKey.isDown || dKey.isDown){
 		monster.body.velocity.x = 270;
 		monster.animations.play('rMotion');

 	} else {
 		monster.animations.play('idle');
 		if(monster.body.velocity.x > 0){
 			monster.body.acceleration.x = -500;
 		} else {
 			monster.body.acceleration.x = 500;
 		}
 	}

 	if((upKey.isDown || wKey.isDown) && monster.body.velocity.y ==0){
 		monster.body.velocity.y = -500;
 	}

}
