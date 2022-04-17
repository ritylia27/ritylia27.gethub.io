var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//ball
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
var ballRadius = 15;

//paddle
var paddleHeight = 15;
var paddleWidth = 85;
var paddleX = (canvas.width-paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

//BRICK
var brickRowCount = 5
var brickColumnCount = 10;
var brickWidth = 33;
var brickHeight = 33;
var brickPadding = 10;
var brickOffsetTop = 50;
var brickOffsetLeft = 30;

//score
var score = 0;
var lives = 3;

//sounds
var soundJump = new Audio();
var soundB = new Audio();
var crush = new Audio();

function soundJumping() {
	soundJump.src = ('sounds/jump2.mp3');
	soundJump.autoplay = true;
}

function soundBrick() {
	soundB.src = ('sounds/bib.mp3')
	soundB.autoplay = true;
}

function soundCrush(){
	crush.src = ('sounds/bomb.mp3')
	crush.autoplay = true;
}

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#2DC9FE";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(((x+ballRadius > b.x && x < b.x+brickWidth) || (x > b.x && x-ballRadius < b.x+brickWidth)) && 
                	((y+ballRadius > b.y && y < b.y+brickHeight) || (y > b.y && y-ballRadius < b.y+brickHeight))) {
                    dy = -dy;
                	soundBrick();
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "30px Sevenet7Cyr";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("SCORE: "+score, 15, 25);
}

function drawLives() {
    ctx.font = "30px Sevenet7Cyr";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("LIVES: "+lives, canvas.width-90, 25);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FC6868";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawBricks();
    drawScore();
    drawLives();
    if(x > canvas.width - ballRadius || x < ballRadius) {
	    dx = -dx;
	    soundJumping();
	}
	if(y < ballRadius) {
	    dy = -dy;
	} else if(y + dy > canvas.height-ballRadius-paddleHeight+3) {
	    if(x+ballRadius > paddleX && x-ballRadius < paddleX + paddleWidth) {
	        dy = -dy;
	        soundJumping()
	    }
	    else {
			lives--;
			soundCrush();
			if(!lives) {
				alert("YOU WIN, CONGRATULATIONS!");
                document.location.reload();
                clearInterval(interval);
			} 
			else {
				x = canvas.width/2;
			    y = canvas.height-30;
			    dx = 2;
			    dy = -2;
			    paddleX = (canvas.width-paddleWidth)/2;
			}
	    }
	}
	if(rightPressed) {
	    paddleX += 7;
	    if (paddleX + paddleWidth > canvas.width){
	        paddleX = canvas.width - paddleWidth;
	    }
	}
	else if(leftPressed) {
	    paddleX -= 7;
	    if (paddleX < 0){
	        paddleX = 0;
	    }
	}
	    x += dx;
	    y += dy;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

var interval = setInterval(draw, 10);
