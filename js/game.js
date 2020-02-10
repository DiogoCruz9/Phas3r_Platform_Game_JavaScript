    var config = {   
    type: Phaser.AUTO,   
    width: 1200,   
    height: 600,    
    pixelArt: false,
    physics: {      
        default: 'arcade',       
        arcade: {           
            gravity: { y: 200},                
        }   

    },   
    scene: {       
        preload: preload,       
        create: create,         
        update: update   
    }
};

var game=new Phaser.Game(config);

var enemy;
var enemydown;
var plat;
var right;
var left;
var explosion;
var scoreP1=0;
var scoreP2=0;
var scoreTextP1;
var scoreTextP2;
var shieldP1=0;
var shieldP2=0;
var P1lives=5;
var P1Life=true;
var P1Death=false;
var P2lives=5;
var P2Life=true;
var P2Death=false;
var lastFired = 0;
var lastFired2 = 0;
var gameend=0;
var SHIELDP1DELAY=false;
var SHIELDP2DELAY=false;

function preload()
{
	this.load.audio("music", "assets/music.wav");
    this.load.image('mountains-back', 'assets/mountains-back.png');
    this.load.image('mountains-mid1', 'assets/mountains-mid1.png');
    this.load.image('mountains-mid2', 'assets/mountains-mid2.png');
    this.load.image('ground', 'assets/ground.png');
	this.load.atlas('bird', 'assets/player.png', 'assets/player.json');
	this.load.atlas('bird2', 'assets/player.png', 'assets/player.json');
	this.load.image("enemy", "assets/enemy.png");
	this.load.image("enemydown", "assets/nuke.png");
	this.load.image("plat", "assets/plat.png");
	this.load.image('bomb', 'assets/bomb.png');
	this.load.image('kaboom', 'assets/Explosion.png');
	this.load.image('space', 'assets/space.jpg');
	this.load.image('ret', 'assets/ret.png');
	this.load.audio("jump", "assets/slime.wav");
	
	this.load.image("laserRed", "assets/laser2.png");
    this.load.image("laserGreen", "assets/laser.png");
	
	this.load.image('shield', 'assets/shield.png');
	this.load.image('bush2', 'assets/bush2.png');
    this.load.image('div', 'assets/div.png');
    this.load.image('nuvens','assets/nuvens.png');

}

function create()
{
	
	 this.music=this.sound.add('music');
	 this.music.setVolume(0.1); 
	 this.music.setLoop(true);
     this.music.play();
	 
	this.cameras.main.setBackgroundColor("#697e96");
    this.mountainsBack = this.add.tileSprite(400,530,800,600,"mountains-back");
    this.mountainsMid1 = this.add.tileSprite(400,530,800,450,"mountains-mid1");
    this.mountainsMid2 = this.add.tileSprite(400,530,800,150,"mountains-mid2");   
	this.bush2 = this.add.tileSprite(400,577,800,280, "bush2");
    this.bush2.tint = 0x697e96;
    this.nuvens = this.add.tileSprite(400,150,800,280, "nuvens");

	
	this.space = this.add.tileSprite(1440,530,0,450,"space");  
	this.ret = this.add.tileSprite(1085,0,0,0,"ret"); 
	this.div = this.physics.add.image(810,300,"div"); 
	this.div.body.setAllowGravity(false);
	this.div.body.immovable = true;
	
	
    
	this.ground = this.add.tileSprite(400,577,800,50, 'ground');	
	this.ground.tint = 0x697e96;
	
    this.physics.add.existing(this.ground, true);
	
    this.bird = this.physics.add.sprite(60,200, 'bird');
	this.bird.setBounce(0.1);
	this.bird.setScale(0.5);
	this.bird.tint = 0x800000;
    this.bird.setCollideWorldBounds(true);
    

	this.jump = this.sound.add('jump');
	
	
	this.bird2 = this.physics.add.sprite(20,200, 'bird2');
	this.bird2.setBounce(0.1);
	this.bird2.setScale(0.5);
	this.bird2.tint = 0x4B0082;
	this.bird2.setCollideWorldBounds(true);
	
	
	
	this.sound.add('jump');
	this.sound.setVolume(0.1); 
	
	
	
	// player 1 walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('bird', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
	
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'bird', frame: 'p1_stand'}],
        frameRate: 10,
    });
	
	// player 2 walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('bird2', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
	
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'bird2', frame: 'p1_stand'}],
        frameRate: 10,
    });
	
	
	this.physics.add.collider(this.ground, this.bird);
	this.physics.add.collider(this.ground, this.bird2);
	this.physics.add.collider(this.bird, this.bird2);
	this.physics.add.collider(this.div, this.bird);
	this.physics.add.collider(this.div, this.bird2);
	
	enemies = this.physics.add.group();
	plats = this.physics.add.group();
	explosions = this.physics.add.group();
    bulletsP1 = this.physics.add.group();   //Balas P1
    bulletsP2 = this.physics.add.group();   //Balas P2
    //bulletsPVPP1 = this.physics.add.group(); //Balas PVP P1
    //bulletsPVPP2 = this.physics.add.group(); //Balas PVP P2
	
	
	

    this.physics.add.collider(this.bird, plats);
	this.physics.add.collider(this.bird2, plats);
		
	timer=this.time.addEvent({ 
			delay: 800, 
			callback: addEnemy, 
			callbackScope: this,
			repeat:-1
	});
	
	timer2=this.time.addEvent({ 
			delay: 3000, 
			callback: addEnemyDown, 
			callbackScope: this,
			repeat:-1
	});
	
	timer3=this.time.addEvent({ 
			delay: 1000, 
			callback: addPlat, 
			callbackScope: this,
			repeat:-1
	});
	
	this.time.addEvent({ 
			delay: 1000, 
			callback: explosionsHandler, 
			callbackScope: this,
			repeat:-1
    });
    
    timer4=this.time.addEvent({ 
        delay: 3000, 
        callback: playerDeathImune, 
        callbackScope: this,
        repeat:-1
    });

    timer5=this.time.addEvent({ 
        delay: 3000, 
        callback: playerDeathImune2, 
        callbackScope: this,
        repeat:-1
    });

	cursors = this.input.keyboard.addKeys(
		{up:Phaser.Input.Keyboard.KeyCodes.UP,
		down:Phaser.Input.Keyboard.KeyCodes.DOWN,
		left:Phaser.Input.Keyboard.KeyCodes.LEFT,
        right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
        shoot:Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
        shield:Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
        shootPvP:Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
		});
	
	teclas = this.input.keyboard.addKeys(
		{up:Phaser.Input.Keyboard.KeyCodes.W,
		down:Phaser.Input.Keyboard.KeyCodes.S,
		left:Phaser.Input.Keyboard.KeyCodes.A,
		right:Phaser.Input.Keyboard.KeyCodes.D,
		shoot:Phaser.Input.Keyboard.KeyCodes.SPACE,
        shield:Phaser.Input.Keyboard.KeyCodes.B, 
        shootPvP:Phaser.Input.Keyboard.KeyCodes.N,
        restart:Phaser.Input.Keyboard.KeyCodes.R, 
		});
		
	scoreTextP1 = this.add.text(1000, 16, 'Score P1: 0', { fontSize: '25px', fill: '#000' });
	scoreTextP2 = this.add.text(1000, 36, 'Score P2: 0', { fontSize: '25px', fill: '#000' });
	
	livesP1 = this.add.text(825, 16, 'Vidas P1: 5', { fontSize: '25px', fill: '#000' });
	livesP2 = this.add.text(825, 36, 'Vidas P2: 5', { fontSize: '25px', fill: '#000' });
	
	objetivo = this.add.text (900, 106, 'OBJETIVO DO JOGO', {font: '30px Cambria' });
	objetivo1 = this.add.text (850, 140, 'Conquistar o planeta Terra, aniquilando', {font: '20px Cambria' });
	objetivo2 = this.add.text (840, 160, 'todos os mísseis enviados pelos humanos', {font: '20px Cambria' });
	objetivo3 = this.add.text (850, 180, 'antes que a outra civilização o consiga!', {font: '20px Cambria' });
	
	end = this.add.text (900, 210, 'O JOGO ACABA SE:', {font: '30px Cambria' });
	end1 = this.add.text (835, 250, 'Um dos jogadores perder as suas 5 vidas!', {font: '20px Cambria' });
	
	controls = this.add.text (930, 290, 'CONTROLOS', {font: '30px Cambria' });
	controls1 = this.add.text (850, 330, 'Jogador RED:', {font: '20px Cambria' });
	controls2 = this.add.text (930, 350, 'UP ARROW : saltar', {font: '15px Cambria' });
	controls3 = this.add.text (930, 365, 'RIGHT ARROW: mover para a direita', {font: '15px Cambria' });
	controls4 = this.add.text (930, 380, 'LEFT ARROW: mover para a esquerda', {font: '15px Cambria' });
	controls5 = this.add.text (930, 395, 'DOWN ARROW: forçar aterragem', {font: '15px Cambria' });
	controls6 = this.add.text (930, 410, 'NUMPAD 0 : disparar', {font: '15px Cambria' });
	controls7 = this.add.text (930, 425, 'NUMPAD 2 : shield', {font: '15px Cambria' });

	controls1 = this.add.text (850, 450, 'Jogador PURPLE:', {font: '20px Cambria' });
	controls2 = this.add.text (930, 470, 'W : saltar', {font: '15px Cambria' });
	controls3 = this.add.text (930, 485, 'D: mover para a direita', {font: '15px Cambria' });
	controls4 = this.add.text (930, 500, 'A: mover para a esquerda', {font: '15px Cambria' });
	controls5 = this.add.text (930, 515, 'S: forçar aterragem', {font: '15px Cambria' });
    controls6 = this.add.text (930, 530, 'SPACEBAR: disparar', {font: '15px Cambria' });
    controls7 = this.add.text (930, 545, 'B: shield', {font: '15px Cambria' });
	
	console.log(this.ground);
	
	this.physics.add.overlap(plats, enemies, hitPlatEnemy, null, this);
    this.physics.add.overlap(explosions, this.bird, hitPlayerExplosion1, null, this);
    this.physics.add.overlap(explosions, this.bird2, hitPlayerExplosion2, null, this);
    this.physics.add.overlap(bulletsP1, enemies, hitBulletP1, null, this);
    this.physics.add.overlap(bulletsP2, enemies, hitBulletP2, null, this);
	this.physics.add.overlap(bulletsP1, this.div, destroybullet1, null, this);
    this.physics.add.overlap(bulletsP2, this.div, destroybullet2, null, this);
    //this.physics.add.overlap(bulletsPVPP1, this.bird2, hitPlayerBulletPvp1, null, this);
    //this.physics.add.overlap(bulletsPVPP2, this.bird, hitPlayerBulletPvp2, null, this);
	//this.physics.add.overlap(bulletsPVPP1, this.div, //, null, this);
	//this.physics.add.overlap(bulletsPVPP2, this.div, //, null, this);
    this.physics.add.overlap(plats, this.div, destroyplat, null, this);
    this.physics.add.overlap(enemies, this.ground, hitGroundEnemy, null, this);
    this.physics.add.overlap(enemies, this.bird, hitPlayerExplosion1, null, this);
    this.physics.add.overlap(enemies, this.bird2, hitPlayerExplosion2, null, this);
    
}
	
function update(time)
{
    this.mountainsBack.tilePositionX += 0.05;
    this.mountainsMid1.tilePositionX += 0.2;
    this.mountainsMid2.tilePositionX += 0.4; 
	this.ground.tilePositionX += 0.4;
    this.bush2.tilePositionX+= 0.4;
    this.nuvens.tilePositionX+=0.05;

    if(P1Death==true && P2Death==true && gameend==0){
        this.add.text(250, 200, 'GAME OVER', { fontSize: '50px', fill: '#000' });
        this.add.text(150, 300, 'PRESS R TO RESTART', { fontSize: '50px', fill: '#000' });
        plats.kill();
        explosions.kill();
        enemies.kill();
        timer.pause= true;
        timer2.pause= true;
        timer3.pause= true;
        timer4.pause= true;
        timer5.pause= true;
        gameend=1;
    }    

    if(teclas.restart.isDown){
        P1lives=5;
        P1Life=true;
        P1Death=false;
        P2lives=5;
        P2Death=false;
        this.bird = this.physics.add.sprite(60,200, 'bird');
	
        this.bird.setBounce(0.1);
        this.bird.setScale(0.5);
        this.bird.tint = 0x800000;
        this.bird.setCollideWorldBounds(true);

        this.bird2 = this.physics.add.sprite(20,200, 'bird2');
        this.bird2.setBounce(0.1);
        this.bird2.setScale(0.5);
        this.bird2.tint = 0x4B0082;
        this.bird2.setCollideWorldBounds(true);

        this.scene.restart();
    }
    

    //JOGADOR 1
if(P1Death==false)
{        
	if(cursors.shield.isDown && shieldP1==0 && SHIELDP1DELAY==false)
    {
        this.shieldCP1 = this.physics.add.sprite(this.bird.body.x+15,this.bird.body.y, 'shield');
        this.shieldCP1.body.setAllowGravity(false);
        this.shieldCP1.body.immovable = true;
        shieldP1=1;
        this.physics.add.overlap(this.shieldCP1, enemies, hitShieldEnemy, null, this);
        timer6=this.time.addEvent({ 
            delay: 1000, 
            callback: shieldP1Lose, 
            callbackScope: this,
            repeat:0
        });
    }
    if(shieldP1==1 )
    {
        this.shieldCP1.body.setVelocityX(this.bird.body.velocity.x);
        this.shieldCP1.body.setVelocityY(this.bird.body.velocity.y);
    }

	
	 if (cursors.left.isDown){  
        this.bird.body.setVelocityX(-200);
        this.bird.anims.play('walk', true); // walk left
        this.bird.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        this.bird.body.setVelocityX(200);
        this.bird.anims.play('walk', true);
        this.bird.flipX = false; // use the original sprite looking to the right
    } else {
        this.bird.body.setVelocityX(0);
        this.bird.anims.play('walk', true);
		this.bird.flipX = false;
    }
    // jump 
    if (cursors.up.isDown && this.bird.body.touching.down)
    {
        this.bird.body.setVelocityY(-300);  
	}
	
	 if(cursors.down.isDown)
	{
		this.bird.body.setVelocityY(300);
    }
    //Disparar
    if(cursors.shoot.isDown && time > lastFired )
    {
        addBulletPlayer1(this.bird.body.x, this.bird.body.y, this.bird.body.velocity.x);
        this.sound.play('jump');
        lastFired = time + 300;
    }
	
}	
    //JOGADOR 2
if(P2Death==false)
{     
	if(teclas.shield.isDown && shieldP2==0 && SHIELDP2DELAY==false)
    {
        this.shieldCP2 = this.physics.add.sprite(this.bird2.body.x+15,this.bird2.body.y, 'shield');
        this.shieldCP2.body.setAllowGravity(false);
        this.shieldCP2.body.immovable = true;
        shieldP2=1;
        this.physics.add.overlap(this.shieldCP2, enemies, hitShieldEnemy, null, this);
        timer6=this.time.addEvent({ 
            delay: 1000, 
            callback: shieldP2Lose, 
            callbackScope: this,
            repeat:0
        });
    }
    if(shieldP2==1 )
    {
        this.shieldCP2.body.setVelocityX(this.bird2.body.velocity.x);
        this.shieldCP2.body.setVelocityY(this.bird2.body.velocity.y);
    }
	
	if (teclas.left.isDown){
        this.bird2.body.setVelocityX(-200);
        this.bird2.anims.play('walk', true); // walk left
        this.bird2.flipX = true; // flip the sprite to the left
    }
    else if (teclas.right.isDown)
    {
        this.bird2.body.setVelocityX(200);
        this.bird2.anims.play('walk', true);
        this.bird2.flipX = false; // use the original sprite looking to the right
    } else {
        this.bird2.body.setVelocityX(0);
        this.bird2.anims.play('walk', true);
    }
    // jump 
    if (teclas.up.isDown && this.bird2.body.touching.down)
    {
        this.bird2.body.setVelocityY(-300);        
    }
	if(teclas.down.isDown)
	{
		this.bird2.setVelocityY(300);
    }
    //Disparar
    if(teclas.shoot.isDown && time > lastFired2)
    {
       // this.bird.body.destroy();
        addBulletPlayer2(this.bird2.body.x, this.bird2.body.y, this.bird2.body.velocity.x);
		this.sound.play('jump');
		lastFired2 = time + 300;
    }
	
}	
    	
}



function hitShieldEnemy(shield,enemy)
{
    enemy.destroy();
}

function shieldP2Lose()
{
    shieldP2=0;
    this.shieldCP2.destroy();
    SHIELDP2DELAY=true;
    this.time.addEvent({ 
        delay: 1000, 
        callback: shieldP2Delay, 
        callbackScope: this,
        repeat:0
    });
}

function shieldP2Delay()
{
    SHIELDP2DELAY=false;
}

function shieldP1Lose()
{
    shieldP1=0;
    this.shieldCP1.destroy();
    SHIELDP1DELAY=true;
    this.time.addEvent({ 
        delay: 1000, 
        callback: shieldP1Delay, 
        callbackScope: this,
        repeat:0
    });
}

function shieldP1Delay()
{
    SHIELDP1DELAY=false;
}

function addOneEnemy(x,y)
{
    enemy = enemies.create(x, y,'enemy'); 
    //enemy.tint = 0xf0000;      // Adicionar velocidade ao tubo para o fazer mover para a esquerda (200)  
    enemy.body.velocity.x=-300;       // Eliminar o tubo quando este já não for visível    
    enemy.checkWorldBounds = true; 
    enemy.body.setAllowGravity(false);
    enemy.outOfBoundsKill = true;
	//enemy.setScale(0.05);
}

function addOneEnemyDown(x,y)
{
    enemydown = enemies.create(x, y,'enemydown'); 
    //enemy.tint = 0xf0000;      // Adicionar velocidade ao tubo para o fazer mover para a esquerda (200)  
    enemydown.body.velocity.y=0;
	//enemy.body.velocity.x = 500;// Eliminar o tubo quando este já não for visível    
    enemydown.checkWorldBounds = true; 
    enemydown.body.setAllowGravity(true);
    enemydown.outOfBoundsKill = true;
	enemydown.setScale(0.05);
}

function addEnemy()
{
    // Atribuir um número aleatório entre 1 e 5 - posição do "espaço"      
    var space = Math.floor(Math.random() * 6) ;      // Adicionar os 6 inimigos com um espaço entre 'space' e 'space + 1'      
    addOneEnemy(750, space * 100);  
	
}

function addEnemyDown()
{
	var space = Math.floor(Math.random() * 4) ;
		
		if(space==0){
			space=1;
		}
		
	addOneEnemyDown(space*200,-20);
}

//adicionar plats
function addOnePlat(x,y)
{
   	plat = plats.create(x, y,'plat'); 
    //plat.tint = 0xf0000;      // Adicionar velocidade ao tubo para o fazer mover para a esquerda (200)  
    plat.body.velocity.x=100;       // Eliminar o tubo quando este já não for visível    
    plat.checkWorldBounds = true; 
    plat.body.setAllowGravity(false);
    plat.outOfBoundsKill = true;
	plat.body.immovable = true;
}

function addPlat()
{
    // Atribuir um número aleatório entre 1 e 5 - posição do "espaço"      
    var space = Math.floor(Math.random() * 6) ;      // Adicionar os 6 tubos com um espaço entre 'space' e 'space + 1'      
    addOnePlat(0, space * 100);               
       
}

function hitPlatEnemy(plat,enemy)
{
	explosion = explosions.create(plat.x,plat.y,'kaboom');
    explosion.body.setAllowGravity(false);
	explosion.body.immovable = true;

	this.physics.add.overlap(this.bird, explosion, hitPlayerExplosion, null, this);



    plat.destroy();
	enemy.destroy();

}

function explosionsHandler()
{
	if(explosions.getLength()>0)
	{
		explosions2=explosions.getFirstAlive();
		explosions2.destroy();
	}
//	this.scene.restart();
}

function playerDeathImune()
{
    if(P1Life==false && P1lives>0)
    {
        this.bird.alpha = 1;
        P1Life=true;
    }
}

function playerDeathImune2()
{
    if(P2Life==false && P2lives>0)
    {
        this.bird2.alpha = 1;
        P2Life=true;
    }
}

function hitPlayerExplosion1(bird)
{
    if(P1Life==true)
     {
        P1lives--;
        bird.alpha = 0.4;
        livesP1.setText("Vidas P1: "+P1lives);
        P1Life=false; 
     }
    if(P1lives<=0 && P1Life==false)
    {
        P1Death = this.physics.add.sprite(bird.x+30,bird.y, 'bird');
        P1Death.setScale(0.5);
        P1Death.body.velocity.y=-200;
        P1Death.body.setAllowGravity(false);
        P1Death.body.immovable = true;
        P1Death=true;   
        bird.destroy();
    }
}

function hitPlayerExplosion2(bird)
{
    if(P2Life==true)
    {
       P2lives--;
       bird.alpha = 0.4;
       livesP2.setText("Vidas P2: "+P2lives);
       P2Life=false; 
    }
   if(P2lives<=0 && P2Life==false)
   {
       P2Death = this.physics.add.sprite(bird.x+30,bird.y, 'bird');
       P2Death.setScale(0.5);
       P2Death.body.velocity.y=-200;
       P2Death.body.setAllowGravity(false);
       P2Death.body.immovable = true;
       P2Death=true;   
       bird.destroy();
   }
}

function hitGroundEnemy(NULL,enemy)
{
    explosion = explosions.create(enemy.x,enemy.y,'kaboom');
    explosion.body.setAllowGravity(false);
	explosion.body.immovable = true;

	enemy.destroy();
}


function addBulletPlayer1(x,y,vx)
{
  
    if(vx<0)
    {
        bullet= bulletsP1.create(x,y+25,'laserRed');
        bullet.body.velocity.x=-450; 
		
    }
    if(vx>=0)
    {
        bullet= bulletsP1.create(x+35,y+25,'laserRed');
        bullet.body.velocity.x=500; 
		
    }
    bullet.checkWorldBounds = true; 
    bullet.body.setAllowGravity(false);
    bullet.outOfBoundsKill = true;
}

function addBulletPlayer2(x,y,vx)
{
    if(vx<0)
	{
        bullet2= bulletsP2.create(x,y+25,'laserGreen');
        bullet2.tint = 0xFF00FF;
        bullet2.body.velocity.x=-450; 
    }
    if(vx>=0)
    {
        bullet2= bulletsP2.create(x+35,y+25,'laserGreen');
        bullet2.tint = 0xFF00FF;
        bullet2.body.velocity.x=500; 
    }
    bullet2.checkWorldBounds = true; 
    bullet2.body.setAllowGravity(false);
    bullet2.outOfBoundsKill = true;
}

function hitBulletP1(bullet,enemy)
{
    scoreP1++;
    scoreTextP1.setText("Score P1: "+scoreP1);
    explosion = explosions.create(enemy.x,enemy.y,'kaboom');
    explosion.body.setAllowGravity(false);
	explosion.body.immovable = true;
    bullet.destroy();
	enemy.destroy();
}

function hitBulletP2(bullet2,enemy)
{
    scoreP2++;
    scoreTextP2.setText("Score P2: "+scoreP2);
    explosion = explosions.create(enemy.x,enemy.y,'kaboom');
    explosion.body.setAllowGravity(false);
	explosion.body.immovable = true;
    bullet2.destroy();
	enemy.destroy();
}

function hitPlatEnemy(plat,enemy)
{
	explosion = explosions.create(plat.x,plat.y,'kaboom');
    explosion.body.setAllowGravity(false);
	explosion.body.immovable = true;
    plat.destroy();
	enemy.destroy();
}


function destroybullet1(bulletpeim,dv){
	dv.destroy();
}

function destroybullet2(bulletpeim2,dv){
	dv.destroy();
}

function destroyplat(plat, dv){
	dv.destroy();
 }

