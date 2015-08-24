var game = new Phaser.Game(820, 560, Phaser.AUTO, 'phaser-game',{preload: preload, create: create, update: update});

//groups
var gIceBlockBorder;
var gIceBlockEnvironment;
var gFire;
var gFireGuys;
var gIceBolt;

//visible objects
var monster;
var fire;
var liquid;
var fireGuy;
var iceBolt;

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
var eTimer;
var animSeqNF;
var iTimer;

//arrays
var harmlessFireGuys = [];

//score
var score;
var style;
var scoreDisplay;

//sounds
var muted;
var soua;
var soub;
var souc;
var soud;
var soue;

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

function preload(){
	game.load.image('bgd_base','assets/images/bgd_base.png');
	game.load.image('wall','assets/images/wall_a1.png');
	game.load.image('monster','assets/images/monster_a1.png');
	game.load.image('therm_base','assets/images/therm_base.png');
	game.load.image('therm_liquid','assets/images/therm_liquid.png');
	game.load.image('iceBolt', 'assets/images/icebolt.png');

	game.load.spritesheet('fire', 'assets/images/fire_a1.png', 64, 64, 4);
	game.load.spritesheet('monsterSpriteSheet', 'assets/images/monstersheet_a1.png', 41, 64, 26);
	game.load.spritesheet('fireGuySpriteSheet', 'assets/images/fireguy_a3.png', 21, 38, 4);

	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	game.load.audio('sa','assets/sounds/sounda.mp3');
	game.load.audio('sb','assets/sounds/soundb.mp3');
	game.load.audio('sc','assets/sounds/soundc.mp3');
	game.load.audio('sd','assets/sounds/soundd.mp3');
	game.load.audio('sd','assets/sounds/sounde.mp3');

}

function create(){
	game.add.sprite(0, 0, 'bgd_base');

	//monster = game.add.sprite(600, 100, 'monster');
	monster = game.add.sprite(832, 560 - ((1 + 1) * 64),'monsterSpriteSheet');
	monster.animations.add('idle', [0,1,2,3], 10, true);
	monster.animations.add('rMotion', [4,5,6,7,8,9], 10, true);
	monster.animations.add('lMotion', [10,11,12,13,14,15], 10, true);
	monster.animations.add('melting', [16,17,18,19,20,21,22,23,24,25], 10, true);	
	monster.animations.add('melted', [25], 10, true);	
	monster.animations.play('idle');

	// fireGuy = game.add.sprite(200, 200, 'fireGuySpriteSheet');
	// fireGuy.animations.add('idle', [0,1,2], 10, true);
	// fireGuy.animations.play('idle');

	gIceBlockBorder = new Phaser.Group(game)
	gIceBlockEnvironment = new Phaser.Group(game);
	gFire = new Phaser.Group(game);
	gFireGuys = new Phaser.Group(game);
	gIceBolt = new Phaser.Group(game);

	logicTimer = 250;
	temperature = 0;
	iTime = 0;

	style = { font: "35px Arial", fill: "#ffffff", align: "center" };
	score = 0;
	scoreDisplay = game.add.text(600,25, "SCORE: " + score, style);
	scoreDisplay.setShadow(2,2, 'rgba(0,0,0,1)',0);

	for(var i = 0; i < 14; i++){
		gIceBlockBorder.add(game.add.sprite((i * 64), 560 - (1 * 64), 'wall'));
	}

	game.physics.enable([monster, gIceBlockBorder], Phaser.Physics.ARCADE);
	monster.body.gravity.y = 1400;
	gIceBlockBorder.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
	    sp.body.immovable = true;
	}, this);

	muted = false;

	soua = game.add.audio('sa');
	soub = game.add.audio('sb');
	souc = game.add.audio('sc');
	soud = game.add.audio('sd');
	soue = game.add.audio('se');

	liquid = game.add.sprite(59, 35, 'therm_liquid');
	game.add.sprite(25, 25, 'therm_base');
	
	liquid.scale.x = (temperature/100);

	gameEnded = false;
	eTimer = 0;

	game.input.keyboard.onUpCallback = function( e ){
            if(e.keyCode == Phaser.Keyboard.M){
                theMuteFunction();
            } else if(e.keyCode == Phaser.Keyboard.P){
            	alert('Game paused, click OK to resume.');
            }
    };

}

function theMuteFunction(){
	console.log('muted:' + muted);
	if(muted){
		
		alert('Sounds are on.');
		muted = false;
	} else {
		
		alert('Sounds are off.');
		muted = true;
	}
	console.log('muted:' + muted);
}

function playA(){
	if(!muted){
		if(!soua.isPlaying ){
			soua.play();
		}
	}
}

function playB(){
	if(!muted){
		if(!soub.isPlaying){
			soub.play();
		}
	}
}

function playC(){
	if(!muted){
		if(!souc.isPlaying){
			souc.play();
		}
	}
}

function playD(){
	if(!muted){
		if(!soud.isPlaying){
			soud.play();
		}
	}
}

function playE(){
	if(!muted){
		if(!soud.isPlaying){
			soud.play();
		}
	}
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
				} else {
					var rnd2 = Math.random();
					if(rnd2 < .35){
						fireGuy = game.add.sprite(853, 560 - ((height + 1) * 64) - 38, 'fireGuySpriteSheet');

						fireGuy.animations.add('idle', [0,1,2], 10, true);
						fireGuy.animations.add('frozen', [3], 10, true);
						fireGuy.animations.play('idle');
						game.physics.enable([fireGuy], Phaser.Physics.ARCADE);
						fireGuy.body.velocity.x = -100 * (logicTimer / 250);
						gFireGuys.add(fireGuy);
					}
				}
}

function removeElementsIce(arrayOfElementsToRemove){
	for(var i = 0; i < arrayOfElementsToRemove.length; i++){
		gIceBlockEnvironment.remove(arrayOfElementsToRemove[i]);
	}
}

function removeElementsIceBolt(arrayOfElementsToRemove){
	for(var i = 0; i < arrayOfElementsToRemove.length; i++){
		gIceBolt.remove(arrayOfElementsToRemove[i]);

	}
}

function gameOver(){
	monster.animations.play('melting');
	gameEnded = true;
	animSeqNF = true;
	eTimer = 0;
}

function monsterFireCollide(heat){
	if(temperature<100){
		if(heat==2){
			temperature++;
			playE();
		} else {
			temperature += .5;	
			playE();
		}

	} else {
		if(!gameEnded){
			gameOver();
		}
	}
}

function update(){
	console.log('logicTimer: ' + logicTimer);
	if(gameEnded && animSeqNF){
		if(eTimer<50){
			eTimer++;
		} else {
			monster.animations.play('melted');
			animSeqNF = false;
			monster.body.immovable = true;
			monster.body.velocity.y = 100;
			alert("YOU MELTED!!!\nGAME OVER!\nSCORE: " + score);
			location.reload();
		}
	}

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
			monsterFireCollide(2);
			} else if((monster.body.y > sp.body.y - 64) && (monster.body.y < sp.body.y + 64)){
			monsterFireCollide(1);
			}
		}
	}, this);

	gFireGuys.forEach(function(sp){
		sp.body.velocity.x = -100 * (logicTimer / 250);
		if((monster.body.x + 64 > sp.body.x) && (monster.body.x < sp.body.x + 21 )){
			if((monster.body.y + 64 > sp.body.y) && (monster.body.y < sp.body.y)){
				var harmless = false;				
				for(var i = 0; i < harmlessFireGuys.length; i++){
					if(sp == harmlessFireGuys[i]){
						harmless = true;
					}
				}
				if(!harmless){
					monsterFireCollide(2);
				}
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

	removeElementsIce(remEle);

	game.physics.arcade.collide(monster, gIceBlockBorder);
	game.physics.arcade.collide(monster, gIceBlockEnvironment);

	if((monster.body.x - 41 < 0)||(monster.body.x > 820 + 41)){
		monsterFireCollide();
	}
	if((monster.body.y + 64 > 560)){
		monsterFireCollide();
	}

	if(!gameEnded){
		if(leftKey.isDown || aKey.isDown){
			monster.body.velocity.x = -270;
			monster.animations.play('lMotion');
	 	} else if(rightKey.isDown || dKey.isDown){
	 		monster.body.velocity.x = 270;
	 		monster.animations.play('rMotion');
	 	} else {
	 		if(!gameEnded){
	 			monster.animations.play('idle');
	 		}
	 		if(monster.body.velocity.x > 0){
	 			monster.body.acceleration.x = -500;
	 		} else {
	 			monster.body.acceleration.x = 500;
	 		}
	 	}
	 	if((upKey.isDown || wKey.isDown) && monster.body.velocity.y ==0){
	 		monster.body.velocity.y = -500;
	 		playA();
	 	}
 	}

 	if(iTimer!=0){
 		if(iTimer < 30){
 			iTimer++;
 		} else {
 			iTimer = 0;
 		}
 	}

 	var remEleIceBolt = [];
	gIceBolt.forEach(function(sp){
		if((sp.body.x < -100) || (sp.body.x > 920) || (sp.body.y < -100) || (sp.body.y > 660)){
			remEleIceBolt.push(sp);
		}
		gFireGuys.forEach(function(ds){
		var proceed = false;

			if((sp.body.x > ds.body.x) && (sp.body.x < ds.body.x + 21)){
				if((sp.body.y > ds.body.y - 20) && (sp.body.y < ds.body.y + 38)){
					
					for(var i = 0; i < harmlessFireGuys.length; i++){
						if(harmlessFireGuys[i]==ds){
							proceed = true;
						}
					}
					if(proceed){

					} else {
						sp.body.x = 1000;
						ds.animations.play('frozen');
						score++;
						scoreDisplay.setText('SCORE: ' + score);
						harmlessFireGuys.push(ds);
						playC();
					}
				}
			}
		}, this);

	}, this);
	removeElementsIceBolt(remEleIceBolt);


 	if(spaceBar.isDown){
 		if(iTimer == 0){
	 		var tempIce1 = game.add.sprite(monster.body.x, monster.body.y + 20, 'iceBolt');
			var tempIce2 = game.add.sprite(monster.body.x, monster.body.y + 20, 'iceBolt');
			var tempIce3 = game.add.sprite(monster.body.x + 10, monster.body.y, 'iceBolt');
			var tempIce4 = game.add.sprite(monster.body.x + 20, monster.body.y + 20, 'iceBolt');
			var tempIce5 = game.add.sprite(monster.body.x + 20, monster.body.y + 20, 'iceBolt');
			var tempIce6 = game.add.sprite(monster.body.x + 10, monster.body.y, 'iceBolt');
			var tempIce7 = game.add.sprite(monster.body.x + 20, monster.body.y + 20, 'iceBolt');
			var tempIce8 = game.add.sprite(monster.body.x - 20, monster.body.y + 20, 'iceBolt');

			game.physics.enable([tempIce1, tempIce2, tempIce3, tempIce4, tempIce5, tempIce6, tempIce7, tempIce8], Phaser.Physics.ARCADE);

			tempIce1.body.velocity.x = -300;

			tempIce2.body.velocity.x = -200;
			tempIce2.body.velocity.y = -200;
			tempIce2.angle = 45;

			tempIce3.body.velocity.y = -300;
			tempIce3.angle = 90;

			tempIce4.body.velocity.x = 200;
			tempIce4.body.velocity.y = -200;
			tempIce4.angle = -45;

			tempIce5.body.velocity.x = 300;

			tempIce6.body.velocity.x = 200;
			tempIce6.body.velocity.y = 200;

			tempIce7.body.velocity.y = 300;
			tempIce7.angle = 90; 

			tempIce8.body.velocity.x = -200;
			tempIce8.body.velocity.y = 200;
			tempIce8.angle = -45;

			gIceBolt.add(tempIce1);
			gIceBolt.add(tempIce2);
			gIceBolt.add(tempIce3);
			gIceBolt.add(tempIce4);
			gIceBolt.add(tempIce5);
			gIceBolt.add(tempIce6);
			gIceBolt.add(tempIce7);
			gIceBolt.add(tempIce8);

			iTimer++;

			playB();
		}
 	}

}
