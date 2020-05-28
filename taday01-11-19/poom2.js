var width = 400, // store screen width
	height = 650, // store screen height
	gLoop,
	points = 0,
	state = true,
	keyState = {}, 
	c = document.getElementById('c'), 
	ctx = c.getContext('2d'); // two dimension graphic canvas
	var canvas = document.getElementById('c');
	

    // set canvas width and height
	c.width = width;
	c.height = height;
// canvas background
var clear = function(){
	ctx.fillStyle = 'pink'; // backgrond color
	ctx.beginPath();
	ctx.rect(0, 0, width, height); // background starting position and size
	ctx.closePath();
	ctx.fill();
}

var howManyCircles = 10, circles = [];

for (var i = 0; i < howManyCircles; i++) 
	circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);

var DrawCircles = function(){
	for (var i = 0; i < howManyCircles; i++) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')'; // circle color 
		ctx.beginPath();
		ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true); 
		ctx.closePath();
		ctx.fill();
	}
};


//added controller
var myLeftBtn;
var myRightBtn;
function controller(){      
    myLeftBtn = new component(90, 90, "rgba(0, 6, 179, 0.1)", 0, 500); 
	myRightBtn = new component(90, 90, "rgba(0, 6, 179, 0.1)", 310, 500);
	myGameArea.start(); // call myGameArea
}// controller


var myGameArea = {
	
    start : function() {
	var that=this;
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);//what
		console.log("poomon001");
        canvas.addEventListener('mousedown', function (e) {
			// e.pageX/pageY = position X/Y axis on the screen		
			if(e.pageX > 310 && e.pageY > 500 && e.pageY < 590 && e.pageX < 410) {
				//alert(canleft);
				keyState[39] = true;
			} 
        })
        canvas.addEventListener('mouseup', function (e) {
		if(e.pageX > 310 && e.pageY > 500 && e.pageY < 590 && e.pageX < 410) {
            keyState[39] = false;
		}
        })
		
		canvas.addEventListener('mousedown', function (e) {
			// e.pageX/pageY = position X/Y axis on the screen		
			if(e.pageX > 0 && e.pageY > 500 && e.pageY < 590 && e.pageX < 90) {
				//alert(canleft);
				keyState[37] = true;
			} 
        })
		
		
		canvas.addEventListener('mouseup', function (e) {
			// e.pageX/pageY = position X/Y axis on the screen		
			if(e.pageX > 0 && e.pageY > 500 && e.pageY < 590 && e.pageX < 90) {
				//alert(canleft);
				keyState[37] = false;
			} 
        })
		
		
        window.addEventListener('touchstart', function (e) {
            player.x = e.pageX;
            player.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            player.x = false;
            player.y = false;
        })
    }/*, 
    clear : function(){
		var that=this;
        that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
    }*/
	
}

function component(width, height, color, x, y) {
	console.log("positioin");
    var that=this;
	that.width = width;
    that.height = height;
    that.x = x;
    that.y = y;    
	//update
    that.update = function() {
        ctx.fillStyle = color;
        ctx.fillRect(that.x, that.y, that.width, that.height);
    }//update
	this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
}// component	
//added controller



var MoveCircles = function(e){
	for (var i = 0; i < howManyCircles; i++) {
		if (circles[i][1] - circles[i][2] > height) {
			circles[i][0] = Math.random() * width;
			circles[i][2] = Math.random() * 100;
			circles[i][1] = 0 - circles[i][2];
			circles[i][3] = Math.random() / 2;
		}
		else {
			circles[i][1] += e;
		}
	}
};

var player = new (function(){
	var that = this;
	that.image = new Image();
	that.image.src = "images/bird3.png";
	that.width = 55;//width of the character
	that.height = 43;//height of the character
	that.frames = 0;
	that.actualFrame = 0;
	that.X = 0;
	that.Y = 0;	
    that.speedX = 0;//added
	that.isJumping = false; 
	that.isFalling = false;
	that.jumpSpeed = 0;
	that.fallSpeed = 0;
    
    that.jump = function() {
        // if it is not on the air or falling, it will jump
		if (!that.isJumping && !that.isFalling) {
			that.fallSpeed = 0;
			that.isJumping = true;
			that.jumpSpeed = 17;
		}//if
	}//jumping speed 

	that.checkJump = function() {
		//a lot of changes here

		if (that.Y > height*0.4) {
			that.setPosition(that.X, that.Y - that.jumpSpeed);		
		}
		else {
			if (that.jumpSpeed > 10) 
				points++;
			// if player is in mid of the gamescreen
			// dont move player up, move obstacles down instead
			MoveCircles(that.jumpSpeed * 0.5);

			platforms.forEach(function(platform, ind){
				platform.y += that.jumpSpeed;

				if (platform.y > height) {
					var type = ~~(Math.random() * 5);
					if (type == 0) 
						type = 1;
					else 
						type = 0;

					platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
				}
			});
		} //checkJump

		that.jumpSpeed--;
		//when the character hit the max height and atarts falling
		if (that.jumpSpeed == 0) {
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}//if

	}
    
	that.fallStop = function(){
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();	
	}

	that.checkFall = function(){
		if (that.Y < height - that.height) {
			that.setPosition(that.X, that.Y + that.fallSpeed);
			that.fallSpeed++;
		} else {
			if (points == 0) 
				that.fallStop();
			else 
				GameOver();
		}
	}
	//added key
	// draw a character position
	that.newPosition = function(){
		console.log(that.speedX);
		that.X = that.X  + that.speedX;
	}//newPosition
    //added key

	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}

	that.interval = 0;
	that.draw = function(){
		try {
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} 
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
		}
		that.interval++;		
	}
})();

//added controller
/*
var botton = function(){			
			ctx.fillStyle = "rgba(0, 6, 179, 0.1)";
	        ctx.fillRect(0, 500, 90, 90);
	        ctx.fillRect(310, 500, 90, 90);
			console.log("poomon003");	
}
//added controller
*/

player.setPosition(~~((width-player.width)/2), height - player.height);
player.jump();
    
	var nrOfPlatforms = 7, //seven pathforms on the screen
		platforms = [],
		platformWidth = 70, //pathform width
		platformHeight = 20; //pathform height

	var Platform = function(x, y, type){
		var that=this;

		that.firstColor = '#FF8C00';
		that.secondColor = '#EEEE00';
		that.onCollide = function(){
			player.fallStop();
		};

		//if pathform is equal to 1, its color is green and jumpspeed change to 50  
		if (type === 1) {
			that.firstColor = '#AADD00';
			that.secondColor = '#698B22';
			that.onCollide = function(){
				player.fallStop();
				player.jumpSpeed = 50;
			};
		}

		
		that.x = ~~ x;
		that.y = y;
		that.type = type;
		//NEW IN PART 5
		that.isMoving = ~~(Math.random() * 2);
		that.direction= ~~(Math.random() * 2) ? -1 : 1;

		that.draw = function(){
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
			gradient.addColorStop(0, that.firstColor);
			gradient.addColorStop(1, that.secondColor);
			ctx.fillStyle = gradient;
			ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
		};

		return that;
	};

	var generatePlatforms = function(){
		var position = 0, type;
		for (var i = 0; i < nrOfPlatforms; i++) {
			type = ~~(Math.random()*5);
			if (type == 0) 
				type = 1;
			else 
				type = 0;
			platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
			if (position < height - platformHeight) 
				position += ~~(height / nrOfPlatforms);
		}
	}();

	var checkCollision = function(){
	platforms.forEach(function(e, ind){
		if (
		(player.isFalling) && 
		(player.X < e.x + platformWidth) && 
		(player.X + player.width > e.x) && 
		(player.Y + player.height > e.y) && 
		(player.Y + player.height < e.y + platformHeight)
		) {
			e.onCollide();
		}
	})
	}
	
//added key
//when press any key down make keyState[key number]=true 
//var keyState = {};    

window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
	//keyState[left/right] = true
	//keyState[left] = true
	//when they are clicking on the left box:
	//keyState[37] = true
},true); 
//when release the key make keyState[key number]=false    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);
//added key

var GameLoop = function(){
	controller();
	clear();
	//MoveCircles(5);
	DrawCircles();

	if (player.isJumping) player.checkJump();
	if (player.isFalling) player.checkFall();

	player.draw();
   
	platforms.forEach(function(platform, index){
		if (platform.isMoving) {
			if (platform.x < 0) {
				platform.direction = 1;
			} else if (platform.x > width - platformWidth) {
				platform.direction = -1;
			}
				platform.x += platform.direction * (index / 2) * ~~(points / 100);
			}
		platform.draw();	
	});
		
		
//added key
    //redraw/reposition your object here
    //also redraw/animate any objects not controlled by the user
	//right
    if(keyState[37]) {
    player.speedX = -10;
    player.newPosition(); //call function newPosition to change speedX to left 10
    }
	//left
     else if(keyState[39]) {
    //console.log("left");
    player.speedX = 10; 
    player.newPosition(); //call function newPosition to change speedX to right 10
    }
 //added key
	
	//added control
    //myGameArea.clear();
    myLeftBtn.update();        
    myRightBtn.update();  
    console.log("poomonUpdate");	
    //updateGameArea

	checkCollision();

	ctx.fillStyle = "Black";
	ctx.fillText("POINTS:" + points, 10, height-10);

	if (state){
		gLoop = setTimeout(GameLoop, 30);
	}	
}//gameloop

	var GameOver = function(){
		state = false;
		clearTimeout(gLoop);
		setTimeout(function(){
			clear();

			ctx.fillStyle = "Black";
			ctx.font = "10pt Arial";
			ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
			ctx.fillText("YOUR RESULT:" + points, width / 2 - 60, height / 2 - 30);
		}, 100);
	};
GameLoop();