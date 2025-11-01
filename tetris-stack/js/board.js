class Board {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
        this.blockSize = 30;
    }

    createGrid() {
        return Array.from({ length: this.height }, () => 
            Array.from({ length: this.width }, () => 0)
        );
    }

    clear() {
        this.grid = this.createGrid();
    }

    isValidMove(piece, x, y, rotation) {
        const shape = rotation !== undefined ? rotation : piece.getShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= this.width || newY >= this.height) {
                        return false;
                    }

                    if (newY < 0) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece(piece) {
        const shape = piece.getShape();
        
        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const y = piece.y + rowIndex;
                    const x = piece.x + colIndex;
                    
                    if (y >= 0) {
                        this.grid[y][x] = {
                            color: piece.color,
                            fixed: true
                        };
                    }
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
   
                this.grid.splice(y, 1);
                this.grid.unshift(Array.from({ length: this.width }, () => 0));
                linesCleared++;
                y++;
            }
        }
        
        return linesCleared;
    }

    draw(ctx) {

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);

        ctx.strokeStyle = '#2a2a3e';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.width; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.blockSize, 0);
            ctx.lineTo(x * this.blockSize, this.height * this.blockSize);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.height; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.blockSize);
            ctx.lineTo(this.width * this.blockSize, y * this.blockSize);
            ctx.stroke();
        }

        this.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.drawBlock(ctx, x, y, cell.color);
                }
            });
        });
    }

    drawBlock(ctx, x, y, color) {
        const blockSize = this.blockSize;
        const blockX = x * blockSize;
        const blockY = y * blockSize;

        ctx.fillStyle = color;
        ctx.fillRect(blockX, blockY, blockSize, blockSize);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(blockX, blockY, blockSize, blockSize);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(blockX + 2, blockY + 2, blockSize - 10, blockSize - 10);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(blockX + 8, blockY + 8, blockSize - 10, blockSize - 10);
    }

    isGameOver() {

        return this.grid[0].some(cell => cell !== 0);
    }
}