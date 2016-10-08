BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game = game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
	this.canonGroup; // group of canonjokergroup and stand;
	
	this.canonJokerGroup; // group of rotating canon and joker
	
	this.joker;
	this.canon;
	this.canonImg;
	this.jokerReleased; // flag to check Joker released
	this.loaderBar;
	this.endGameCalled;

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {
		
		

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		
		
		this.jokerReleased = false;
		this.endGameCalled = false;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);	
		//this.game.physics.gravity.y = 200;
		this.game.world.setBounds(0, 0, 1920, 768);
		this.game.camera.y = 432; 
		this.add.image(0,0,'background');
		this.addLoaderBar();
		this.addCompleteCanonGroup();
		
		this.addCanon();		
		this.addJoker();
		this.addCanonImg();
		this.addCanonStand();		
		
		this.addInteraction();

	},
	addLoaderBar:function(){
		this.loaderBar = this.game.add.sprite(50, 700, 'loaderBar');
    this.loaderBar.animations.add('energy',[] , 60,true, true);
    this.loaderBar.animations.play('energy');
	},
	
	//currentFrame
	addCompleteCanonGroup:function(){
		this.canonGroup = this.game.add.group();
		this.canonGroup.x = 50;
		this.canonGroup.y = 530;
	},	
	
	addCanonStand:function(){		
		var canonStandImg = this.add.image(42,60,'canonStand');
		this.canonGroup.add(canonStandImg);
	},
	
	addCanon:function(){
		this.canon = this.add.sprite(100, 70, '');
		
		this.canon.anchor.setTo(1,1);
		this.canonGroup.addChild(this.canon);
		
		//this.canonJokerGroup.addChild(canon);
	},
	addCanonImg:function(){
		this.canonImg = this.add.image(-110,-70,'canon');
		this.canon.addChild(this.canonImg);
	},
	
	addJoker:function(){
		this.joker = this.add.sprite(-90, -130, 'joker');
		//this.joker.anchor.setTo(0.5,0.5);
		this.canon.addChild(this.joker);
		//this.moveJoker();
		//this.moveJoker();
	},
	
	addInteraction:function(){
		this.game.input.onDown.add(this.moveJoker, this);
	},
	
	moveJoker:function(){
			 this.loaderBar.animations.stop();
	this.game.input.onDown.remove(this.moveJoker,this);
		this.jokerReleased = true;
		this.game.physics.enable(this.joker, Phaser.Physics.ARCADE);
		//console.log(this.loaderBar.currentFrame);
		var velocityX = (this.loaderBar.animations.currentFrame.index + 1) * 9;
		console.log(velocityX);
		
		var velocityY = -(this.game.physics.arcade.angleToPointer(this.canon) * 1000);
		 this.joker.body.velocity.setTo(velocityX, -900);
		//this.joker.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.canon.angle, 300));
    
    //  This makes the game world bounce-able
     this.joker.body.collideWorldBounds = true;
    
    //  This sets the image bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
     this.joker.body.bounce.set(0,0);

 	this.joker.body.gravity.set(0, 800);


		this.game.camera.follow(this.joker);
		//this.canonImg.bringToTop();
	},

	

	update: function () {
		var rotationVal =(this.game.physics.arcade.angleToPointer(this.canon));
		if(rotationVal > 0.1 && rotationVal < 0.9 )
			{
		if(this.jokerReleased == false){
		this.canon.rotation =  rotationVal;
		}
			}
		if(this.jokerReleased)
		{
			
			
			if(this.joker.body.onFloor()){
			//alert('hit floor');
				this.endGame();
				this.endGameCalled = true;
				
			}else{
				this.joker.rotation = this.joker.body.angle;
			}
		}

	},
	
	endGame:function(){
		if(this.endGameCalled == false){
			var distanceX = Math.round((this.joker.x - this.canonGroup.x)/10);
			this.joker.body.velocity.x = 0;
			this.joker.rotation = 0.3;
			alert('Your distance is: '+distanceX+' meters');
			
		}
	},
	
	render:function(){
	this.game.debug.spriteInfo(this.joker, 32, 32);
		
		
		this.game.debug.text((this.canon.rotation), 32, 150);
		
	
		if(this.jokerReleased){
		this.game.debug.text((this.game.physics.arcade.angleToPointer(this.canon) * 1000) , 32, 250);			
		}
		//this.game.physics.arcade.angleToPointer(this.canon)-0.9
		
		
		},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
