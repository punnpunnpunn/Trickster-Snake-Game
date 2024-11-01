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
    checkGameOver(){
        return (arrayIncludes(this.body.slice(0,-1), [this.snakeX, this.snakeY]))
    }
}

class Food {
    constructor(foodX, foodY) {
        this.foodX = foodX
        this.foodY = foodY
    }
    drawFood() {
        context.fillStyle="red";
        context.fillRect(this.foodX, this.foodY, blockSize, blockSize);
    }
    placeFood(snake) {
        do {
            this.foodX = Math.floor(Math.random()*cols)*blockSize;
            this.foodY = Math.floor(Math.random()* rows) * blockSize;
        }
        while (arrayIncludes(snake.body, [this.foodX, this.foodY]))
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

function arrayEquals (a,b) {
    return a.length === b.length && a.every((element, index) => element === b[index]);
}

function arrayIncludes (a, b) {
    return a.some(element => arrayEquals(element, b));
}

function changeDirection(key) {
    if (key.code == "ArrowUp" && snake.snakeChangeY == 0) {
        snake.snakeChangeX = 0;
        snake.snakeChangeY = 1;
    }
    else if (key.code == "ArrowDown" && snake.snakeChangeY == 0) {
        snake.snakeChangeX = 0;
        snake.snakeChangeY = -1;
    }
    else if (key.code == "ArrowLeft" && snake.snakeChangeX == 0) {
        snake.snakeChangeX = 1;
        snake.snakeChangeY = 0;
    }
    else if (key.code == "ArrowRight" && snake.snakeChangeX == 0) {
        snake.snakeChangeX = -1;
        snake.snakeChangeY = 0;
    }
}

function update() {
    snake.updateSnake();
    snake.drawSnake();
    if (food.foodX == snake.snakeX && food.foodY == snake.snakeY) {
        food.placeFood(snake);
        food.drawFood();
        score.innerHTML = `Score: ${snake.updateScore()}`
    }
    else {
        snake.updateTail();
        snake.drawTail();
    }
    if (snake.checkGameOver()) {
        game.gameOver();
    }
}

function play() {
    snake = new Snake(blockSize * 5, blockSize * 10, 1, 0)
    food = new Food(blockSize * 10, blockSize * 10)
    clearInterval(intervalID)
    game.drawBoard();
    document.addEventListener("keydown", changeDirection)
    score.innerHTML = "Score: 0"
    food.drawFood();
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