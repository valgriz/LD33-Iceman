var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

//visible objects
var gIceBlockBorder;
var gIceBlockEnvironment;
var monster;
var fire;

//animations
var flame;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;
var spaceBar;

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

function preload(){

	game.load.image('bgd_base','assets/images/bgd_base.png');
	game.load.image('wall','assets/images/wall_a1.png');
	game.load.image('monster','assets/images/monster_a1.png');

	game.load.spritesheet('fire', 'assets/images/fire_a1.png', 64, 64, 4);


	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//game.camera.follow(ant);
}

function create(){

	game.add.sprite(0, 0, 'bgd_base');

	monster = game.add.sprite(600, 100, 'monster');
	

	gIceBlockBorder = new Phaser.Group(game)
	gIceBlockEnvironment = new Phaser.Group(game);

	fire = game.add.sprite(200,200,'fire');

	fire.animations.add('flame', [0,1,2,3], 10, true);
	fire.animations.play('flame');

	for(var i = 0; i < 14; i++){
		//top
		//gIceBlockBorder.add(game.add.sprite((i * 64), 0, 'wall'));
		//bottom
		gIceBlockBorder.add(game.add.sprite((i * 64), 560 - (1 * 64), 'wall'));
	}
	for(var i = 0; i < 6; i++){
		//left
		//gIceBlockBorder.add(game.add.sprite(0, 64 + (i * 64), 'wall'));
		//right
		//gIceBlockBorder.add(game.add.sprite((10 * 64), 64 + (i * 64), 'wall'));
			
	}

	game.physics.enable([monster, gIceBlockBorder], Phaser.Physics.ARCADE);
	monster.body.gravity.y = 1400;
	gIceBlockBorder.forEach(function(sp){
		sp.body.velocity.x = -100;
	    sp.body.immovable = true;
	}, this);



}

function spawnEnvironmentBlock(height){
	gIceBlockEnvironment.add(game.add.sprite(832,  560 - ((height + 1) * 64), 'wall'));
	game.physics.enable([gIceBlockEnvironment], Phaser.Physics.ARCADE);
	gIceBlockEnvironment.forEach(function(ds){
					ds.body.velocity.x = -100;
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

function update(){

	gIceBlockBorder.forEach(function(sp){
		if(sp.body.x <= -64){
			sp.body.x = 832;
			var rnd = Math.random();
			if(rnd < .6){
				
				spawnEnvironmentBlock(1);
			}

		}
	}, this);

	var remEle = [];

	gIceBlockEnvironment.forEach(function(sp){
		if(sp.body.x <= -64){
				sp.body.x = 100;
				sp.body.y = 100;
				remEle.push(sp);
		}
	}, this);

	removeElements(remEle);

	game.physics.arcade.collide(monster, gIceBlockBorder);
	game.physics.arcade.collide(monster, gIceBlockEnvironment);

	if(leftKey.isDown || aKey.isDown){
		monster.body.velocity.x = -270;

 	} else if(rightKey.isDown || dKey.isDown){
 		monster.body.velocity.x = 270;

 	} else {
 		if(monster.body.velocity.x > 0){
 			monster.body.acceleration.x = -500;
 		} else {
 			monster.body.acceleration.x = 500;
 		}
 	}

 	if(upKey.isDown || wKey.isDown){
 		monster.body.velocity.y = -500;
 	}
}
