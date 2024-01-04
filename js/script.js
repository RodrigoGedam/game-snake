const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score_value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

const size = 30; //Determina o tamanho da cobra, comida e da célula do grid.
const initialPosition = { x: randomPosition(), y: randomPosition() };
let snake = [initialPosition];

function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function randomPosition() {
	const number = randomNumber(0, canvas.width - size);

	return Math.round(number / size) * size;
}

const food = {
	x: randomPosition(),
	y: randomPosition(),
	color: "firebrick",
};

function incrementScore() {
	score.innerText = +score.innerText + 10;
}

let direction, loopId;
let borderless = true;

function drawFood() {
	const { x, y, color } = food;

	ctx.shadowColor = "cyan";
	ctx.shadowBlur = 20;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, size, size);
	ctx.shadowBlur = 0;
}

function drawSnake() {
	ctx.fillStyle = "yellowgreen";
	ctx.strokeStyle = "palegreen";

	snake.forEach((position, index) => {
		if (index === snake.length - 1) {
			ctx.fillStyle = "darkgreen";
		}
		ctx.fillRect(position.x, position.y, size, size);
		ctx.strokeRect(position.x, position.y, size, size);
	});
}

function moveSnake() {
	if (!direction) return;

	const head = snake[snake.length - 1];

	snake.shift();

	if (direction == "right") {
		snake.push({ x: head.x + size, y: head.y });
	}

	if (direction == "left") {
		snake.push({ x: head.x - size, y: head.y });
	}

	if (direction == "down") {
		snake.push({ x: head.x, y: head.y + size });
	}

	if (direction == "up") {
		snake.push({ x: head.x, y: head.y - size });
	}
}

function drawGrid() {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "whitesmoke";

	for (let i = 30; i < canvas.width; i += 30) {
		ctx.beginPath();
		ctx.lineTo(i, 0);
		ctx.lineTo(i, 600);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineTo(0, i);
		ctx.lineTo(600, i);
		ctx.stroke();
	}
}

function checkFood() {
	const head = snake[snake.length - 1];

	if (head.x == food.x && head.y == food.y) {
		snake.push(head);

		let x = randomPosition();
		let y = randomPosition();

		while (snake.find((position) => position.x == x && position.y == y)) {
			x = randomPosition();
			y = randomPosition();
		}

		audio.play();
		incrementScore();

		food.x = x;
		food.y = y;
	}
}

function checkCollision(borderless) {
	const head = snake[snake.length - 1];
	const bodyIndex = snake.length - 2;

	let wallCollision = false;

	const selfCollision = snake.find((position, index) => {
		return index < bodyIndex && position.x == head.x && position.y == head.y;
	});

	if (borderless) {
		if (head.x < 0) head.x = canvas.width - size;
		if (head.x > canvas.width - size) head.x = 0;
		if (head.y < 0) head.y = canvas.height - size;
		if (head.y > canvas.height - size) head.y = 0;
	} else {
		if (
			head.x < 0 ||
			head.x > canvas.width - size ||
			head.y < 0 ||
			head.y > canvas.height - size
		) {
			wallCollision = true;
		}
	}

	if (selfCollision || wallCollision) {
		gameOver();
	}
}

function gameOver() {
	direction = undefined;

	menu.style.display = "flex";
	finalScore.innerText = score.innerText;
	canvas.style.filter = "blur(2px)";
}

function gameLoop() {
	clearInterval(loopId);

	ctx.clearRect(0, 0, 600, 600);

	drawGrid();
	moveSnake();
	checkCollision(false);
	checkFood();
	drawFood();
	drawSnake();

	loopId = setTimeout(() => {
		gameLoop();
	}, 150);
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {
	if (key == "ArrowRight" && direction != "left") direction = "right";
	if (key == "ArrowLeft" && direction != "right") direction = "left";
	if (key == "ArrowUp" && direction != "down") direction = "up";
	if (key == "ArrowDown" && direction != "up") direction = "down";
});

buttonPlay.addEventListener("click", () => {
	score.innerText = "00";
	menu.style.display = "none";
	canvas.style.filter = "none";

	snake = [initialPosition];
});
