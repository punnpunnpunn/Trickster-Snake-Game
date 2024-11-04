class Snake {
    constructor (snakeX, snakeY, snakeChangeX, snakeChangeY, ) {
        this.snakeX = snakeX
        this.snakeY = snakeY
        this.snakeChangeX = snakeChangeX
        this.snakeChangeY = snakeChangeY
        this.body =  [[snakeX, snakeY], [snakeX - blockSize, snakeY - blockSize]]
        this.score = 0
    }
    drawSnake() {
        context.fillStyle="lime";
        context.fillRect(this.snakeX, this.snakeY, blockSize, blockSize);
    }
    updateSnake() {
        // random warping
        if (this.snakeChangeX * blockSize + this.snakeX < 0 || this.snakeChangeX * blockSize + this.snakeX >= board.width){
            this.snakeX = (this.snakeChangeX * blockSize + this.snakeX + board.width) % (cols * blockSize);
            this.snakeY = Math.floor(Math.random() * rows) * blockSize
        }
        else if (this.snakeChangeY * blockSize + this.snakeY < 0 || this.snakeChangeY * blockSize + this.snakeY >= board.height){
            this.snakeX = Math.floor(Math.random() * cols) * blockSize
            this.snakeY = (this.snakeChangeY * blockSize + this.snakeY + board.height) % (rows * blockSize);
        }
        // normal movement
        else {
            this.snakeX = this.snakeChangeX * blockSize + this.snakeX
            this.snakeY = this.snakeChangeY * blockSize + this.snakeY
        }
        this.body.push([this.snakeX, this.snakeY])
    }
    drawTail() {
        context.fillStyle="black";
        context.fillRect(this.tailX, this.tailY, blockSize, blockSize);
    }
    updateTail() {
        [this.tailX, this.tailY] = this.body.shift();
    }
    updateScore() {
        this.score += 1
        return this.score
    }
    getScore() {
        return this.score
    }
    checkGameOver(){
        return (arrayIncludes(this.body.slice(0,-1), [this.snakeX, this.snakeY]))
    }
}

class Food {
    constructor(foodX, foodY) {
        this.foodX = foodX
        this.foodY = foodY
        this.color
    }
    drawFood(color) {
        this.color = color
        context.fillStyle=color;
        context.fillRect(this.foodX, this.foodY, blockSize, blockSize);
    }
    placeFood(snake) {
        do {
            this.foodX = Math.floor(Math.random()*cols)*blockSize;
            this.foodY = Math.floor(Math.random()* rows) * blockSize;
        }
        while (arrayIncludes(snake.body, [this.foodX, this.foodY]))
    }
    getColor() {
        return this.color
    }
}

class Game {
    constructor(board, context) {
        this.board = board
        this.context = context
    }

    drawBoard() {
        this.context.fillStyle="black";
        this.context.fillRect(0, 0, this.board.width, this.board.height);
    }

    gameOver() {
        clearInterval(intervalID)
        this.context.fillStyle = "white"
        this.context.font = "50px Arial"
        this.context.fillText("Game Over", 100, Math.floor(this.board.height/2)+50/2)
    }
}

class Rickroll {
    constructor(rickroll) {
        this.audio = rickroll
    }
    play() {
        this.audio.src = 'Rickroll.mp4';
        this.audio.play();
        document.getElementById("rickvid").src="Rickroll.mp4";
    }
    stop() {
        this.audio.pause();
    }
}

function arrayEquals (a,b) {
    return a.length === b.length && a.every((element, index) => element === b[index]);
}

function arrayIncludes (a, b) {
    return a.some(element => arrayEquals(element, b));
}

function changeDirection(key) {
    if (key.code == controls[0] && snake.snakeChangeY == 0) {
        snake.snakeChangeX = 0;
        snake.snakeChangeY = -1;
    }
    else if (key.code == controls[1] && snake.snakeChangeY == 0) {
        snake.snakeChangeX = 0;
        snake.snakeChangeY = 1;
    }
    else if (key.code == controls[2] && snake.snakeChangeX == 0) {
        snake.snakeChangeX = -1;
        snake.snakeChangeY = 0;
    }
    else if (key.code == controls[3] && snake.snakeChangeX == 0) {
        snake.snakeChangeX = 1;
        snake.snakeChangeY = 0;
    }
}

function keydown(key) {
    if (key.code == controls[0]) {
        up.style.backgroundColor = "grey"
    }
    if (key.code == controls[1]) {
        down.style.backgroundColor = "grey"
    }    
    if (key.code == controls[2]) {
        left.style.backgroundColor = "grey"
    }
    if (key.code == controls[3]) {
        right.style.backgroundColor = "grey"
    }
}

function keyup(key) {
    if (key.code == controls[0]) {
        up.style.backgroundColor = "white"
    }
    if (key.code == controls[1]) {
        down.style.backgroundColor = "white"
    }    
    if (key.code == controls[2]) {
        left.style.backgroundColor = "white"
    }
    if (key.code == controls[3]) {
        right.style.backgroundColor = "white"
    }
}

function changeControls(color) {
    if (color == "blue") {
        controls = [controls[1], controls[0], controls[3], controls[2]]
        controlHTML = [controlHTML[1], controlHTML[0], controlHTML[3], controlHTML[2]]
    }
    up.innerHTML = controlHTML[0]
    down.innerHTML = controlHTML[1]
    left.innerHTML = controlHTML[2]
    right.innerHTML = controlHTML[3]
}

function update() {
    if (food.foodX == snake.snakeX && food.foodY == snake.snakeY) {
        changeControls(food.getColor())
        food.placeFood(snake);
        score.innerHTML = `Score: ${snake.updateScore()}`
        if (snake.score % 5 == 0) {
            food.drawFood("blue")
        }
        else {
            food.drawFood("red");
        }
    }
    else {
        snake.updateTail();
        snake.drawTail();
    }
    snake.updateSnake();
    snake.drawSnake();
    if (snake.checkGameOver()) {
        game.gameOver();
    }
    if (snake.score > 20 && !rickrollOn) {
        rick = new Rickroll(rickroll)
        rick.play()
        rickrollOn = true
    }
}

function play() {
    game.gameOver()
    snake = new Snake(blockSize * 5, blockSize * 10, 1, 0)
    food = new Food(blockSize * 10, blockSize * 10)
    game.drawBoard();
    document.addEventListener("keydown", changeDirection)
    document.addEventListener("keydown", keydown)
    document.addEventListener("keyup", keyup)
    score.innerHTML = "Score: 0"
    food.drawFood("red");
    controls = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] // up, down, left, right
    controlHTML = ["↑","↓","←","→"]
    intervalID = setInterval(update, 100);
}

//board
var blockSize = 25;
var rows = 18;
var cols = 18;
var game;
var intervalID;
var snake
var food
var rick
var rickroll = document.getElementById("rickaudio")
var rickrollOn = false
var controls
var controlHTML
up = document.getElementById("up")
down = document.getElementById("down")
left = document.getElementById("left")
right = document.getElementById("right")

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    game = new Game(board, context)
    score = document.getElementById("score")
    playbtn = document.getElementById("play")
    game.drawBoard();
    score.innerHTML = "Score: 0"
    playbtn.onclick = function() {play()}
}