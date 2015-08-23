var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});



var gIceBlockBorder;

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

function preload(){

	game.load.image('bgd_base','assets/images/bgd_base.png');
	game.load.image('wall','assets/images/wall_a1.png');


}

function create(){

	game.add.sprite(0, 0, 'bgd_base');
	

	gIceBlockBorder = new Phaser.Group(game)

	for(var i = 0; i < 11; i++){
		//top
		gIceBlockBorder.add(game.add.sprite((i * 64), 0, 'wall'));
		//bottom
		gIceBlockBorder.add(game.add.sprite((i * 64), (7 * 64), 'wall'));

	}
	for(var i = 0; i < 6; i++){
		//left
		gIceBlockBorder.add(game.add.sprite(0, 64 + (i * 64), 'wall'));
		//right
		gIceBlockBorder.add(game.add.sprite((10 * 64), 64 + (i * 64), 'wall'));
			
	}



	game.add.sprite(0, 0, 'wall');

}

function update(){

}
