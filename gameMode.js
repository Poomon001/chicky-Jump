/**This game works for all PC and IOS systems**/
var width = 400; // store screen width
var	height = 650; // store screen height
var	gLoop;//game Loop
var	points = 0; //initial point
var	state = true; //start game
var	keyState = {}; //controller
var	c = document.getElementById('c'); 
var	ctx = c.getContext('2d'); // two dimension graphic canvas
localStorage.BestPoint;
	
// set canvas width and height
	c.width = width;
	c.height = height;
	
// canvas background
var clear = function(){
	var img = document.getElementById("bg")
    var pat = ctx.createPattern(img, "repeat");
	ctx.beginPath();
    ctx.fillStyle = pat;
	ctx.rect(0, 0, width, height); // background starting position and size
	ctx.closePath();
	ctx.fill();
}//clear


// check the users' device
var myLeftBtn;
var myRightBtn;
function controller(){   
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    myLeftBtn = new component(90, 90, "rgba(0, 6, 179, 0.1)", 0, 500); 
	myRightBtn = new component(90, 90, "rgba(0, 6, 179, 0.1)", 310, 500);
	}//if   
}//controller

// receive two sets of value(fisrt and second bottons' width, height, color, position x and position y)
function component(width, height, color, x, y) {
	
	//apply color, heigh, width, x position and y position
    this.update = function() {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
    }//update
        
		//control the character from a IOS screen
        window.addEventListener('touchstart', function (e) {
			// e.pageX/pageY = position X/Y axis on the screen		
			if(e.pageX > 260 && e.pageY > 450 && e.pageY < 640 && e.pageX < 470) {
				keyState[39] = true;	
			}//if         
        })//tap on
		
        window.addEventListener('touchstart', function (e) {
			// e.pageX/pageY = position X/Y axis on the screen		
			if(e.pageX > 0 && e.pageY > 450 && e.pageY < 640 && e.pageX < 140) {
				keyState[37] = true;
			}//if         
        })//tap on
		
        window.addEventListener('touchend', function (e) {
		if(e.pageX > 260 && e.pageY > 450 && e.pageY < 640 && e.pageX < 470) {
            keyState[39] = false;
		}//if
        })//tap off
		
        window.addEventListener('touchend', function (e) {
		if(e.pageX > 0 && e.pageY > 450 && e.pageY < 640 && e.pageX < 140) {
            keyState[37] = false;
		}//if
        })//tap off
}// component	


//character
var player = new (function(){
	//that refer to local not instant variable!
	var that = this;
	
	that.image = new Image();
	that.image.src = "images/bird3.png";//import the charactor
	that.width = 55;//width of the character
	that.height = 43;//height of the character
	that.frames = 0;
	that.actualFrame = 0;
	that.X = 0;//x position of the character
	that.Y = 0;//y position of the character	
    that.speedX = 0; // horizontal speed
	that.isJumping = false;//no jump
	that.isFalling = false;//no fall
	that.jumpSpeed = 0;
	that.fallSpeed = 0;
  
    that.jump = function() {
        // if it is not jumping (on the air) or falling
		if (!that.isJumping && !that.isFalling) {
			that.fallSpeed = 0;
			that.isJumping = true;
			that.jumpSpeed = 17;
		}//if
	}//jump 

	that.checkJump = function() {
		
		//character's position is higher than height of the screen*0.4
		if (that.Y > height*0.4) {
			that.setPosition(that.X, that.Y - that.jumpSpeed);//move character down	
		}else {
			if (that.jumpSpeed > 10){ 
				points++;//increase a point every 10 height
			}//if
			
			// if player is in mid of the gamescreen
			// dont move player up, move obstacles down instead
			platforms.forEach(function(platform, ind){
				platform.y += that.jumpSpeed;
				if (platform.y > height) {
					
					//random number (0-6) and round it up
					var type = ~~(Math.random() * 8);
					if (type == 0) {
						type = 1;
					} else if(type == 1) {
						type = 2;
					} else if(type == 2) {
						type = 3;
					}else {
						type = 0;
					}
					platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
				}//if
			});
		}//if
		
		that.jumpSpeed--;
		//when the character hit the max height and starts falling
		if (that.jumpSpeed == 0) {
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}//if
	}//checkJump
	
	that.fallStop = function(){
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();	
	}//fallStop
	
	that.checkFall = function(){
		
		//if the character position is below the screen, the game is over
		if (that.Y < height - that.height) {
			that.setPosition(that.X, that.Y + that.fallSpeed);
			that.fallSpeed++;
		} else {
			
			//reset the score
			if (points == 0) 
				that.fallStop();
			else 
				GameOver();
		}//if
	}//checkFall 

	// draw a new character position
	that.newPosition = function(){
		that.X = that.X  + that.speedX;
	}//newPosition

    //x & y are a position of the charactor
	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}//setPosition

	that.interval = 0;
	that.draw = function(){
		try {
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		}//try 
		catch (e) {
		};

		if (that.interval == 4 ) {
			if (that.actualFrame == that.frames) {
				that.actualFrame = 0;
			}
			else {
				that.actualFrame++;
			}
			that.interval = 0;
		}//if
		that.interval++;		
	}//draw
})();

player.setPosition(~~((width-player.width)/2), height - player.height);
player.jump();
    
	var nrOfPlatforms = 7, //seven pathforms on the screen
		platforms = [],
		platformWidth = 70, //pathform width
		platformHeight = 20; //pathform height
    
	var Platform = function(x, y, type){
		var that=this;
		that.firstColor = '#FF8C00';//orange
		that.secondColor = '#EEEE00';//yello
		that.onCollide = function(){
			player.fallStop();
		};//Platform
 
		//if type is 1, make green pathform
		if (type === 1) {
			that.firstColor = '#AADD00';//green
			that.secondColor = '#698B22';//dark gren
			that.onCollide = function(){
				player.fallStop();
				player.jumpSpeed = 50;
			};//onCollide
		}//if
		
		//if type is 0, make green pathform
		if (type === 2) {
			that.firstColor = '#FFFFFF';//white
			that.secondColor = '#D3D3D3';//gray
			that.onCollide = function(){
			player.fallStop();
			player.jumpSpeed = 13;
			//setTimeout(resize, 200);
			};//onCollide
		}	
			//if type is 0, make green pathform
		if (type === 3) {
			that.firstColor = '#000000';//white
			that.secondColor = '#D3D3D3';//gray
			that.onCollide = function(){
			player.fallStop();
			platformWidth = 40;
			setTimeout(resize, 4000);
			};//onCollide
		}//if
		
		
		that.x = ~~ x;
		that.y = y;
		that.type = type;
		//NEW IN PART 5
		that.isMoving = ~~(Math.random() * 2);
		that.direction= ~~(Math.random() * 2) ? -1 : 1;
        
		//draw path
		that.draw = function(){
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
			gradient.addColorStop(0, that.firstColor);
			gradient.addColorStop(1, that.secondColor);
			ctx.fillStyle = gradient;
			ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
		};//draw

		return that;
	};
    
	//resize the pathform to 70
	var resize = function(){
		platformWidth = 70;
	}//resize
	
	//create 2 types of paths
	var generatePlatforms = function(){
		var position = 0, type;
		for (var i = 0; i < nrOfPlatforms; i++) {
			
			//random number (0-6) and round the number
			type = ~~(Math.random()*8);
			if (type == 0) {
				type = 1;//green path
			} else if (type == 1){ 
				type = 2;//white
			}else if(type == 2){
				type = 3;//black
			}else{
				type = 0;//oraange
			}
			
			platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
			//random X position
			if (position < height - platformHeight) 
				position += ~~(height / nrOfPlatforms);
		}
	}();
    //check every plaftorm when the character steps on 
	var checkCollision = function(){
	platforms.forEach(function(e, ind){
		//when player is falling
		if (
		(player.isFalling) && 
		(player.X < e.x + platformWidth) && 
		(player.X + player.width > e.x) && 
		(player.Y + player.height > e.y) && 
		(player.Y + player.height < e.y + platformHeight)
		) {
			e.onCollide();
		}//if
	})
	}//checkCollision
	

//when press any key down make keyState[key number]=true 
//var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true); 
//when release the key make keyState[key number]=false    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

//loop game
var GameLoop = function(){
	//check users' devices
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	controller();//call controller 
    clear();
	if (player.isJumping) player.checkJump();
	if (player.isFalling) player.checkFall();
	player.draw();//draw character
    
	//moving pltform
	platforms.forEach(function(platform, index){
		if (platform.isMoving) {
			if (platform.x < 0) {
				platform.direction = 1;
			} else if (platform.x > width - platformWidth) {
				platform.direction = -1;
			}
				platform.x += platform.direction * (index / 2) * ~~(points / 100);
			}//if
		platform.draw();	
		
	});//pathform
		

    //redraw/reposition your object here
    //also redraw/animate any objects not controlled by the user
	//right
    if(keyState[37]) {
    player.speedX = -10;
    player.newPosition(); //call function newPosition to change speedX to left 10
    }//if
	
	//left
	if(keyState[39]) {
    player.speedX = 10; 
    player.newPosition(); //call function newPosition to change speedX to right 10
    }//if
	
	//Make the player move through walls
    if (player.X > width) {
    player.X = 0 - player.width;
    } else if (player.X < 0 - player.width) { 
    player.X = width;
    }//if	

//draw screen botton only for mobile devices
if (isMobile) {
    myLeftBtn.update();        
    myRightBtn.update();  
}//if
	checkCollision();//call checkCollision
	ctx.fillStyle = "Black";//black text color
	ctx.fillText("BEST SCORE:" + localStorage.BestPoint, 10, height-30);//display best score
	ctx.fillText("POINTS:" + points, 10, height-10);//display point

	if (state){
		gLoop = setTimeout(GameLoop, 30);
	}//reload every 0.03sec	
}//gameloop

//unhidden game
var goToPlay = function(){
	document.getElementById("end").style.visibility = "hidden";
	document.getElementById("c").style.visibility = "visible";
	document.getElementById("startingPage").style.visibility = "hidden";
}//goToPlay

//unhidden instruction
var goToInstruction = function(){
	document.getElementById("c").style.visibility = "hidden";
	document.getElementById("credits").style.visibility = "hidden";
	document.getElementById("startingPage").style.visibility = "hidden";
	document.getElementById("instruction").style.visibility = "visible";
}//goToInstruction

//unhidden credits
var goToCredits = function(){
	document.getElementById("c").style.visibility = "hidden";
	document.getElementById("credits").style.visibility = "visible";
	document.getElementById("startingPage").style.visibility = "hidden";
}//goToCredits

//go to homepage
var goToHome = function(){
	document.getElementById("end").style.visibility = "hidden";
	document.getElementById("c").style.visibility = "hidden";
	document.getElementById("credits").style.visibility = "hidden";
	document.getElementById("instruction").style.visibility = "hidden";
	document.getElementById("startingPage").style.visibility = "visible";
}//goToHome
	
	//go to homepage and reset the game
 var replay = function(){
 	var that = this;
    	points = 0;
	    state = true;
	    that.X = 0;
	    that.Y = 0;	
	    clear();
	    GameLoop();
    	document.getElementById("end").style.visibility = "hidden";
		document.getElementById("c").style.visibility = "hidden";
		document.getElementById("credits").style.visibility = "hidden";
		document.getElementById("instruction").style.visibility = "hidden";
		document.getElementById("startingPage").style.visibility = "visible";
	}//replay
 
    //display gameover screen
	var GameOver = function(){
		
		//store the best score to the local storage	
		if (typeof(Storage) !== "undefined") {
			if(localStorage.BestPoint == undefined){
				localStorage.BestPoint = 0;
			}
			if(localStorage.BestPoint < points){
				localStorage.BestPoint = points;
			}//if
		}//if

		state = false;
		clearTimeout(gLoop);
		setTimeout(function(){
			clear();
			ctx.fillStyle = "black";// font color
			ctx.font = "10pt Arial";
			ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
			ctx.fillText("BEST SCORE:" + localStorage.BestPoint, width / 2 - 60, height / 2 - 30);
			ctx.fillText("YOUR SCORE:" + points, width / 2 - 60, height / 2 +20);
		}, 100);
     	document.getElementById("end").style.visibility = "visible";
			};//gameOver
GameLoop();//call GameLoop