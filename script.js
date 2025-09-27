document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const bird = document.getElementById('bird');
    const scoreDisplay = document.getElementById('score');
    const message = document.getElementById('message');
    const ground = document.getElementById('ground');

    const GAME_HEIGHT = 600;
    const GROUND_HEIGHT = 100;
    const BIRD_SIZE = 40;
    const GRAVITY = 0.1;
    const JUMP_POWER = -3;
    const PIPE_SPEED = 2;
    const PIPE_WIDTH = 60;
    const PIPE_GAP = 150;

    let birdY = (GAME_HEIGHT / 2) - (BIRD_SIZE / 2);
    let velocity = 0;
    let score = 0;
    let isPlaying = false;
    let gameLoopInterval;
    let pipeCreationInterval;

    bird.style.top = `${birdY}px`;

    function startGame() {
        if (isPlaying) return;

        isPlaying = true;
        score = 0;
        scoreDisplay.innerText = score;
        velocity = 0;
        birdY = (GAME_HEIGHT / 2) - (BIRD_SIZE / 2);
        bird.style.top = `${birdY}px`;
        message.style.display = 'none';

        document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());

        gameLoopInterval = requestAnimationFrame(gameLoop);
        pipeCreationInterval = setInterval(createPipe, 2000); // Create a new pipe every 2 seconds
    }

    function endGame() {
        isPlaying = false;
        cancelAnimationFrame(gameLoopInterval);
        clearInterval(pipeCreationInterval);
        message.innerHTML = `Game Over! Score: ${score}<br>Press SPACE to Restart`;
        message.style.display = 'block';
    }

    function jump() {
        if (isPlaying) {
            velocity = JUMP_POWER;
        }
    }

    function applyGravity() {
        velocity += GRAVITY;
        birdY += velocity;

        if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        bird.style.top = `${birdY}px`;

        const rotation = Math.min(Math.max(-90, velocity * 3), 45); 
        bird.style.transform = `rotate(${rotation}deg)`;
    }

    function checkCollision() {
        if (birdY + BIRD_SIZE >= GAME_HEIGHT - GROUND_HEIGHT) {
            endGame();
            return true;
        }
        
        const birdRect = bird.getBoundingClientRect();

        document.querySelectorAll('.pipe').forEach(pipe => {
            const pipeRect = pipe.getBoundingClientRect();

            if (
                birdRect.left < pipeRect.right &&
                birdRect.right > pipeRect.left &&
                birdRect.top < pipeRect.bottom &&
                birdRect.bottom > pipeRect.top
            ) {

                endGame();
                return true;
            }
        });
        return false;
    }

    function createPipe() {
        const minHeight = 50;
        const maxHeight = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - minHeight;
        const topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        const bottomPipeHeight = GAME_HEIGHT - GROUND_HEIGHT - topPipeHeight - PIPE_GAP;

        const topPipe = document.createElement('div');
        topPipe.classList.add('pipe', 'pipe-top');
        topPipe.style.height = `${topPipeHeight}px`;
        topPipe.style.left = `${gameContainer.offsetWidth}px`;
        topPipe.scored = false; 
        gameContainer.appendChild(topPipe);

        const bottomPipe = document.createElement('div');
        bottomPipe.classList.add('pipe', 'pipe-bottom');
        bottomPipe.style.height = `${bottomPipeHeight}px`;
        bottomPipe.style.left = `${gameContainer.offsetWidth}px`;
        bottomPipe.style.bottom = `${GROUND_HEIGHT}px`;
        gameContainer.appendChild(bottomPipe);
    }

    function movePipes() {
        document.querySelectorAll('.pipe').forEach(pipe => {
            let currentLeft = parseFloat(pipe.style.left);
            currentLeft -= PIPE_SPEED;
            pipe.style.left = `${currentLeft}px`;

            if (currentLeft + PIPE_WIDTH < 0) {
                pipe.remove();
            }

            if (pipe.classList.contains('pipe-top') && !pipe.scored && currentLeft + PIPE_WIDTH < 140) {
                score++;
                scoreDisplay.innerText = score;
                pipe.scored = true;
            }
        });
    }

    function gameLoop() {
        if (!isPlaying) return;

        applyGravity();
        movePipes();

        if (checkCollision()) {
            return;
        }

        gameLoopInterval = requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            if (!isPlaying) {
                startGame();
            } else {
                jump();
            }
        }
    });
});
