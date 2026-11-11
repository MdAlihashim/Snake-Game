const board = document.querySelector('.board');
const score = document.querySelector('#score');
const time = document.querySelector('#time');
const highScore = document.querySelector('#high-score');
const startGamePage = document.querySelector('.start-game');
const startGameBtn = document.querySelector('#start-btn');
const outGamePage = document.querySelector('.outGame');
const outGameBtn = document.querySelector('#out-btn');
const blockWidth = 50;
const blockHeight = 50;

let rows = 0;
let cols = 0;
const blocks = {};

let snake = [{ x: 1, y: 3 }];
let food = { x: 0, y: 0 };
let direction = 'down';
let currentScore = 0;
let currentTime = `00:00`;
let currentHighScore = localStorage.getItem('highScore') || 0;
let gameInterval = null;
let timeInterval = null;

highScore.innerText = currentHighScore

const spawnFood = () => {
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
};

const setupBoard = () => {
    board.innerHTML = '';
    rows = Math.floor(board.clientHeight / blockHeight);
    cols = Math.floor(board.clientWidth / blockWidth);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.classList.add('block');
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }
};

const render = () => {
    let head = null;
    outGamePage.classList.add('out-game-hide');

    if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
        clearInterval(gameInterval);
        outGamePage.classList.remove('out-game-hide');
        outGamePage.classList.add('out-game');
        return;
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        spawnFood();
        currentScore += 1;
        score.innerText = currentScore;
        if (currentScore > currentHighScore) {
            currentHighScore = currentScore
            localStorage.setItem('highScore', JSON.stringify(currentHighScore))
        }
    } else {
        snake.pop();
    }

    blocks[`${food.x}-${food.y}`].classList.add('food');

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
};

addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

startGameBtn.addEventListener('click', () => {
    timeInterval = setInterval(() => {
        let [min, sec] = currentTime.split(':').map(Number)
        if (sec == 59) {
            min+=1
            sec = 0
        } else {
            sec+=1
        }
        currentTime = `${min}:${sec}`
        time.innerText = currentTime
    }, 1000)
    startGamePage.classList.add('start-game-hide');
    startGamePage.classList.remove('start-game');
    setupBoard();
    spawnFood();
    gameInterval = setInterval(render, 300);
});

outGameBtn.addEventListener('click', () => {
    outGamePage.classList.add('out-game-hide');
    outGamePage.classList.remove('out-game');
    setupBoard();
    snake = [{ x: 1, y: 3 }];
    direction = 'down';
    currentScore = 0;
    currentTime = `00:00`;
    score.innerText = currentScore;
    highScore.innerText = currentHighScore;
    time.innerText = currentTime
    spawnFood();
    gameInterval = setInterval(render, 300);
});
