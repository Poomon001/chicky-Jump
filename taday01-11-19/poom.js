var width = 400, // store screen width
	height = 650, // store screen height
	gLoop,
	points = 0,
	state = true,
	keyState = {}, 
	c = document.getElementById('c'), 
	ctx = c.getContext('2d'); // two dimension graphic canvas
	

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

/*
//added controller
function controller(){
    myLeftBtn = new component(300, 300, "blue", 20, 40);    
    myRightBtn = new component(30, 30, "blue", 80, 40);
console.log("hello");
}// controller
function component(width, height, color, x, y) {
    var that=this;

	that.width = width;
    that.height = height;
    that.x = x;
    that.y = y;    
    that.update = function() {
        ctx2 = ctx;
        ctx2.fillStyle = color;
        ctx2.fillRect(that.x, that.y, that.width, that.height);
    }//update
}// component

function updateGameArea() {
    clear();	
    myLeftBtn.update();        
    myRightBtn.update();  
    console.log("poomon");	
}//updateGameArea
//added controller
*/


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
	//added
	// draw a character position
	that.newPosition = function(){
		console.log(that.speedX);
		that.X = that.X  + that.speedX;
	}//newPosition
    //added

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
		//that.interval = setInterval(updateGameArea, 200);// added controller
})();
/*
//added controller
var bottonWidth = 300, //pathform width
bottonHeight = 300; //pathform height
that = this;

var botton = function(){			
			ctx.fillStyle = "blue";
			ctx.fillRect(30, 30, bottonWidth, bottonHeight);
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

		//if pathform is equal to 1, its color is green and jumpspeed chage to 50  
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
			ctx.fillRect(that.x, that.y, platformWidth, platformHeight);console.log("poomon001");
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
	
//added
//when press any key down make keyState[key number]=true 
//var keyState = {};    

window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true); 
//when release the key make keyState[key number]=false    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);


//added//

var GameLoop = function(){
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
	ctx.fillStyle = "rgba(0, 6, 179, 0.1)";
	ctx.fillRect(0, 500, 90, 90);
	ctx.fillRect(310, 500, 90, 90);
	});
		
		
		
//added
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
 //added
	
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