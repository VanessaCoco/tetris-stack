class Controls {
    constructor(game) {
        this.game = game;
        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (this.game.gameOver) return;

            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.game.movePiece(-1, 0);
                    break;
                    
                case 'ArrowRight':
                    event.preventDefault();
                    this.game.movePiece(1, 0);
                    break;
                    
                case 'ArrowDown':
                    event.preventDefault();
                    this.game.movePiece(0, 1);
                    break;
                    
                case 'ArrowUp':
                    event.preventDefault();
                    this.game.rotatePiece();
                    break;
                    
                case ' ':
                    event.preventDefault();
                    this.game.togglePause();
                    break;
            }
        });

        window.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        }, false);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        new Controls(game);
    }, 100);
});