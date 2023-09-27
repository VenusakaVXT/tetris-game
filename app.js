import decorate from './color.js';
import {
    COLUMNS,
    ROWS,
    BLOCK_SIZE,
    COLOR_MAPPING,
    CELL_COLOR_ID,
    BRICK_LAYOUT,
    KEY_CODES
} from './constants.js'

decorate();

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLUMNS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.splitCells();
        this.score = 0;
        this.highScore = 0;
        this.loseGame = false;
        this.isPlaying = false;

        this.audio = new Audio('./sounds/success.wav');
    }

    splitCells() {
        return Array.from({length: ROWS}, () => 
            Array(COLUMNS).fill(CELL_COLOR_ID)
        )
    }

    // Get by flexbox: crossAxis:(x, 0) && mainAxis:(0, y)
    drawCells(crossAxis, mainAxis, colorId) {
        this.ctx.fillStyle = COLOR_MAPPING[colorId] || COLOR_MAPPING[CELL_COLOR_ID];
        this.ctx.fillRect(crossAxis * BLOCK_SIZE, mainAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.fillStyle = '#000';
        this.ctx.strokeRect(crossAxis * BLOCK_SIZE, mainAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCells(col, row, this.grid[row][col]);
            }
        }
    }

    handleCompleteRows() {
        const insertRows = board.grid.filter((row) => {
            return row.some(col => col === CELL_COLOR_ID);
        })

        const newScore = ROWS - insertRows.length; // newScore: total number of completed rows
        const newRows = Array.from({length: newScore}, () => 
            Array(COLUMNS).fill(CELL_COLOR_ID)
        )

        if (newScore) {
            board.grid = [...newRows, ...insertRows];
            this.handleScore(newScore * 10);
            this.audio.volume = 1;
            this.audio.play();
        }
    }

    handleScore(newScore) {
        this.score += newScore;
        document.getElementById('score').innerText = this.score;
        document.getElementById('high-score').innerText = this.highScore;
    }

    gameOver() {
        this.loseGame = true;
        this.isPlaying = false;
        const loseSound = document.createElement('audio');
        loseSound.src = './sounds/lose.wav';
        loseSound.play();
        if (loseSound.played) {
            let gameOverNotification = setInterval(() => { 
                alert('Game Over');
                clearInterval(gameOverNotification)
            }, 1000)
        }
        
    }

    resetGame() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.score = 0;
        this.grid = this.splitCells();
        this.loseGame = false;
        this.drawBoard();
    }
}

class Brick {
    // The id parameter is used to get the color (corresponding to the color id of COLOR_MAPPING ) 
    // and define the shape for the brick.
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id];
        this.activeIndex = 0; // Rotation direction style position in each layout is only numbered from 0 -> 3
        this.colPos = 3; // default
        this.rowPos = -2; // default
        // this.moveSound = new Audio('./sounds/move_sound.mp3');
        // remove moveSound because it feels uncomfortable when there are too many sounds :)))
    }

    drawBrick() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== CELL_COLOR_ID) {
                    board.drawCells(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }

    clearBrick() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== CELL_COLOR_ID) {
                    board.drawCells(col + this.colPos, row + this.rowPos, CELL_COLOR_ID);
                }
            }
        }
    }

    // Rules to control moving bricks:
    // moveLeft, moverRight: to the left, to the right
    // moveDown: Help the brick go down faster
    // rotateBrick: The brick will not go up, but when pressed up the brick will rotate.

    moveLeft() {
        if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
            this.clearBrick(); // delete the old location first
            this.colPos--; // brick to the left 1 time
            this.drawBrick();
            // this.moveSound.volume = 1;
            // this.moveSound.play();
        }
    }

    moveRight() {
        if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
            this.clearBrick(); // delete the old location first
            this.colPos++; // brick to the right 1 time
            this.drawBrick();
            // this.moveSound.volume = 1;
            // this.moveSound.play();
        }
    }

    moveDown() {
        if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
            this.clearBrick(); // delete the old location first
            this.rowPos++; // brick to the down 1 time
            this.drawBrick();
            return;
        }

        this.landing();

        if (!board.loseGame) {
            randomNewBrick();
        }
    }

    rotateBrick() {
        if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[(this.activeIndex + 1) % 4])) {
            this.clearBrick();
            // Get balance as new activeIndex for layout
            this.activeIndex = (this.activeIndex + 1) % 4;
            /**
             * activeIndex = 0 ==> (0 + 1) % 4 = 1
             * activeIndex = 1 ==> (1 + 1) % 4 = 2
             * activeIndex = 2 ==> (2 + 1) % 4 = 3
             * activeIndex = 3 ==> (3 + 1) % 4 = 0
             **/
            this.drawBrick();
            // this.moveSound.volume = 1;
            // this.moveSound.play();
        }
    }

    // The check function avoids collision and moves off the board
    checkCollision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== CELL_COLOR_ID && nextRow >= 0) {
                    if (
                      (row + nextRow >= ROWS) ||
                      (col + nextCol >= COLUMNS) ||
                      (col + nextCol < 0) ||
                      (board.grid[row + nextRow][col + nextCol] !== CELL_COLOR_ID)
                    ) return true;
                }
            }
        }

        return false;
    }

    // Handle landed
    landing() {
        if (this.rowPos <= 0) {
            board.gameOver();
            return;
        }

        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== CELL_COLOR_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }

        board.handleCompleteRows();
        board.drawBoard();
    }
}


function randomNewBrick() {
    // Generate any 1 id from 0 -> 6
    brick = new Brick(Math.floor(Math.random() * 10) % BRICK_LAYOUT.length);
}


// mainHandle()
// init
const board = new Board(ctx);
board.drawBoard();


// declare var for global scope use
var brick;
var refresh; // variable set interval

// handleButtons
document.getElementById('play-btn').addEventListener('click', () => {
    board.isPlaying = true;
    board.resetGame();
    randomNewBrick();
    
    refresh = setInterval(() => {
        if (!board.loseGame) {
            brick.moveDown();
        } else {
            clearInterval(refresh);
        }
    }, 1000)
})


// Game control
document.addEventListener('keydown', (e) => {
    if (!board.loseGame && board.isPlaying) {
        switch(e.code) {
            case KEY_CODES.LEFT:
                brick.moveLeft();
                break;
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.UP:
                brick.rotateBrick();
                break;
            default:
                break;
        }
    }
})

// Settings game
// Turn on/off volume
const backgroundMusic = document.createElement('audio');
backgroundMusic.src = './sounds/tetris_game_soundtrack.mp3';

const turnVolumeBtn = document.getElementById('turn-volume-btn');
let isTurnVolume = false;

turnVolumeBtn.addEventListener('click', function() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        this.innerHTML = `<i class='bx bxs-volume-full'></i>`;
        isTurnVolume = true;
    } else {
        backgroundMusic.pause();
        this.innerHTML = `<i class='bx bxs-volume-mute'></i>`
        board.audio.pause();
        isTurnVolume = false;
        // brick.moveSound.src = null;
    }
})

// Start the game is turn on the background music
document.getElementById('play-btn').addEventListener('click', () => {
    if (isTurnVolume) {
        backgroundMusic.play();
    }

    backgroundMusic.loop = true;
})

// Pause/continue
document.getElementById('pause-btn').addEventListener('click', function() {
    this.classList.toggle('alter'); // alter: customize pause button
})

document.getElementById('pause-btn').addEventListener('click', () => {
    if (board.isPlaying) {
        clearInterval(refresh);
        backgroundMusic.pause();
        board.audio.pause();
        board.isPlaying = false;
    } else {
        refresh = setInterval(() => {
            if (!board.loseGame) {
                brick.moveDown();
            } else {
                clearInterval(refresh);
            }
        }, 1000)

        if (isTurnVolume) {
            backgroundMusic.play();
        }
        
        board.isPlaying = true;
    }
})

// Handling block control by phone
document.getElementById('rotate').addEventListener('touchstart', (e) => {
    e.preventDefault();
    brick.rotateBrick();
})

document.getElementById('left').addEventListener('touchstart', (e) => {
    e.preventDefault();
    brick.moveLeft();
})

document.getElementById('right').addEventListener('touchstart', (e) => {
    e.preventDefault();
    brick.moveRight();
})

document.getElementById('down').addEventListener('touchstart', (e) => {
    e.preventDefault();
    brick.moveDown();
})