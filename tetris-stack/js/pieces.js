class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
    }

    rotate() {
        const rotated = [];
        const size = this.shape.length;

        for (let i = 0; i < size; i++) {
            rotated[i] = [];
            for (let j = 0; j < size; j++) {
                rotated[i][j] = this.shape[size - 1 - j][i];
            }
        }
        
        return rotated;
    }

    getShape() {
        return this.shape;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class PieceFactory {
    static createRandomPiece() {
        const pieces = [
            {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00f5ff'
            },
            {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#800080'
            },
            {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#ff8c00'
            },
            {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#0000ff'
            },
            {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00ff00'
            },
            {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#ff0000'
            }
        ];

        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        return new Piece(randomPiece.shape, randomPiece.color);
    }

    static drawPiece(ctx, piece, x, y, blockSize) {
        const shape = piece.getShape();
        ctx.fillStyle = piece.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const blockX = x + colIndex * blockSize;
                    const blockY = y + rowIndex * blockSize;

                    ctx.fillRect(blockX, blockY, blockSize, blockSize);

                    ctx.strokeRect(blockX, blockY, blockSize, blockSize);
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fillRect(blockX + 2, blockY + 2, blockSize - 10, blockSize - 10);
                    ctx.fillStyle = piece.color;
                }
            });
        });
    }
}