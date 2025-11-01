class Game {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.nextPieceCanvas = document.getElementById('next-piece');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        
        this.board = new Board();
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.board.clear();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = 1000;
        
        this.currentPiece = PieceFactory.createRandomPiece();
        this.nextPiece = PieceFactory.createRandomPiece();
        
        this.updateDisplay();
        this.gameLoop();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            if (this.gameOver) {
                this.initializeGame();
            } else if (this.paused) {
                this.togglePause();
            }
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.initializeGame();
        });
    }

    togglePause() {
        this.paused = !this.paused;
        this.updateGameStatus();
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }

    updateGameStatus() {
        const statusElement = document.getElementById('game-status');
        
        if (this.gameOver) {
            statusElement.textContent = 'FIM DE JOGO! Clique em "Iniciar Jogo" para jogar novamente.';
            statusElement.style.color = '#e74c3c';
        } else if (this.paused) {
            statusElement.textContent = 'JOGO PAUSADO';
            statusElement.style.color = '#f39c12';
        } else {
            statusElement.textContent = 'JOGO EM ANDAMENTO';
            statusElement.style.color = '#27ae60';
        }
    }

    gameLoop() {
        if (this.gameOver || this.paused) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }

        const currentTime = Date.now();
        
        if (currentTime - this.dropTime > this.dropInterval) {
            this.dropPiece();
            this.dropTime = currentTime;
        }

        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    dropPiece() {
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.move(0, 1);
        } else {
            this.lockPiece();
        }
    }

    lockPiece() {
        this.board.placePiece(this.currentPiece);
        
        const linesCleared = this.board.clearLines();
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = PieceFactory.createRandomPiece();
        
        if (!this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
            this.updateGameStatus();
        }
        
        this.updateDisplay();
    }

    updateScore(linesCleared) {
        const points = [0, 40, 100, 300, 1200];
        this.score += points[linesCleared] * this.level;
        this.lines += linesCleared;
        this.level = Math.floor(this.lines / 10) + 1;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
    }

    movePiece(dx, dy) {
        if (this.gameOver || this.paused) return;
        
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x + dx, this.currentPiece.y + dy)) {
            this.currentPiece.move(dx, dy);
        }
    }

    rotatePiece() {
        if (this.gameOver || this.paused) return;
        
        const rotated = this.currentPiece.rotate();
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);

        this.board.draw(this.ctx);
        
        if (this.currentPiece) {
            PieceFactory.drawPiece(
                this.ctx, 
                this.currentPiece, 
                this.currentPiece.x * this.board.blockSize, 
                this.currentPiece.y * this.board.blockSize, 
                this.board.blockSize
            );
        }
 
        if (this.nextPiece) {
            const nextPieceSize = 25;
            const offsetX = (this.nextPieceCanvas.width - this.nextPiece.shape[0].length * nextPieceSize) / 2;
            const offsetY = (this.nextPieceCanvas.height - this.nextPiece.shape.length * nextPieceSize) / 2;
            
            PieceFactory.drawPiece(
                this.nextPieceCtx,
                this.nextPiece,
                offsetX,
                offsetY,
                nextPieceSize
            );
        }
    }
}

let game;

window.addEventListener('load', () => {
    game = new Game();
});