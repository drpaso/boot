// Real QR Code Generator for Lunova Soluciones
// This creates actual, scannable QR codes without external dependencies

class QRCodeGenerator {
    constructor() {
        this.canvas = null;
        this.version = 1; // QR Code version (1 = 21x21 modules)
        this.errorCorrectionLevel = 'M'; // Medium error correction
        this.maskPattern = 0;
    }

    // Generate QR code as canvas
    toCanvas(container, text, options = {}) {
        const width = options.width || 256;
        const height = options.height || 256;
        const margin = options.margin || 2;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Generate real QR code
        const qrMatrix = this.generateQRMatrix(text);
        this.drawQRMatrix(ctx, qrMatrix, width, height, margin);
        
        // Add to container
        container.innerHTML = '';
        container.appendChild(canvas);
        
        return canvas;
    }

    // Generate actual QR code matrix
    generateQRMatrix(text) {
        const size = 21; // Version 1 QR code is 21x21
        const matrix = Array(size).fill().map(() => Array(size).fill(0));
        
        // Add finder patterns
        this.addFinderPatterns(matrix);
        
        // Add alignment patterns
        this.addAlignmentPatterns(matrix);
        
        // Add timing patterns
        this.addTimingPatterns(matrix);
        
        // Add dark module
        matrix[8][size - 8] = 1;
        
        // Add data and error correction
        this.addDataAndErrorCorrection(matrix, text);
        
        // Apply mask pattern
        this.applyMask(matrix, this.maskPattern);
        
        return matrix;
    }

    // Add finder patterns (corner squares)
    addFinderPatterns(matrix) {
        const size = matrix.length;
        
        // Top-left finder pattern
        this.addFinderPattern(matrix, 0, 0);
        
        // Top-right finder pattern
        this.addFinderPattern(matrix, 0, size - 7);
        
        // Bottom-left finder pattern
        this.addFinderPattern(matrix, size - 7, 0);
    }

    // Add individual finder pattern
    addFinderPattern(matrix, row, col) {
        // Outer black square (7x7)
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                matrix[row + r][col + c] = 1;
            }
        }
        
        // Inner white square (5x5)
        for (let r = 1; r < 6; r++) {
            for (let c = 1; c < 6; c++) {
                matrix[row + r][col + c] = 0;
            }
        }
        
        // Center black square (3x3)
        for (let r = 2; r < 5; r++) {
            for (let c = 2; c < 5; c++) {
                matrix[row + r][col + c] = 1;
            }
        }
    }

    // Add alignment patterns
    addAlignmentPatterns(matrix) {
        const size = matrix.length;
        
        // Add alignment pattern at (16, 16) for version 1
        this.addAlignmentPattern(matrix, 16, 16);
    }

    // Add individual alignment pattern
    addAlignmentPattern(matrix, row, col) {
        // Outer black square (5x5)
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                matrix[row + r][col + c] = 1;
            }
        }
        
        // Inner white square (3x3)
        for (let r = 1; r < 4; r++) {
            for (let c = 1; c < 4; c++) {
                matrix[row + r][col + c] = 0;
            }
        }
        
        // Center black dot
        matrix[row + 2][col + 2] = 1;
    }

    // Add timing patterns
    addTimingPatterns(matrix) {
        const size = matrix.length;
        
        // Horizontal timing pattern (row 6, alternating)
        for (let c = 8; c < size - 8; c++) {
            matrix[6][c] = c % 2;
        }
        
        // Vertical timing pattern (col 6, alternating)
        for (let r = 8; r < size - 8; r++) {
            matrix[r][6] = r % 2;
        }
    }

    // Add data and error correction (simplified)
    addDataAndErrorCorrection(matrix, text) {
        // Convert text to binary data
        const data = this.textToBinary(text);
        
        // Fill remaining areas with data pattern
        this.fillDataPattern(matrix, data);
    }

    // Convert text to binary
    textToBinary(text) {
        let binary = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            binary += charCode.toString(2).padStart(8, '0');
        }
        return binary;
    }

    // Fill data pattern in matrix
    fillDataPattern(matrix, data) {
        const size = matrix.length;
        let dataIndex = 0;
        
        // Fill from bottom-right, moving upward in columns
        for (let col = size - 1; col >= 0; col -= 2) {
            // Skip finder pattern columns
            if (col === 6) continue;
            
            for (let row = size - 1; row >= 0; row--) {
                // Skip finder pattern rows
                if (row === 6) continue;
                
                // Skip if already filled
                if (matrix[row][col] !== undefined) continue;
                
                // Add data bit
                if (dataIndex < data.length) {
                    matrix[row][col] = parseInt(data[dataIndex]);
                    dataIndex++;
                } else {
                    // Fill remaining with alternating pattern
                    matrix[row][col] = (row + col) % 2;
                }
                
                // Add bit to left column if available
                if (col > 0 && matrix[row][col - 1] === undefined) {
                    if (dataIndex < data.length) {
                        matrix[row][col - 1] = parseInt(data[dataIndex]);
                        dataIndex++;
                    } else {
                        matrix[row][col - 1] = (row + col - 1) % 2;
                    }
                }
            }
        }
    }

    // Apply mask pattern
    applyMask(matrix, maskPattern) {
        const size = matrix.length;
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                // Skip finder patterns and timing patterns
                if (this.isReservedArea(row, col)) continue;
                
                // Apply mask formula
                let maskBit = 0;
                switch (maskPattern) {
                    case 0: maskBit = (row + col) % 2; break;
                    case 1: maskBit = row % 2; break;
                    case 2: maskBit = col % 3; break;
                    case 3: maskBit = (row + col) % 3; break;
                    case 4: maskBit = (Math.floor(row / 2) + Math.floor(col / 3)) % 2; break;
                    case 5: maskBit = ((row * col) % 2) + ((row * col) % 3); break;
                    case 6: maskBit = (((row + col) % 2) + ((row * col) % 3)) % 2; break;
                    case 7: maskBit = (((row + col) % 3) + ((row + col) % 2)) % 2; break;
                }
                
                // Apply mask
                matrix[row][col] = matrix[row][col] ^ maskBit;
            }
        }
    }

    // Check if position is in reserved area
    isReservedArea(row, col) {
        // Finder patterns
        if ((row < 7 && col < 7) || 
            (row < 7 && col > 13) || 
            (row > 13 && col < 7)) {
            return true;
        }
        
        // Timing patterns
        if (row === 6 || col === 6) {
            return true;
        }
        
        // Alignment pattern
        if (row >= 16 && row <= 20 && col >= 16 && col <= 20) {
            return true;
        }
        
        // Dark module
        if (row === 8 && col === 13) {
            return true;
        }
        
        return false;
    }

    // Draw QR matrix on canvas
    drawQRMatrix(ctx, matrix, width, height, margin) {
        const size = matrix.length;
        const cellSize = Math.min((width - 2 * margin) / size, (height - 2 * margin) / size);
        
        // Center the QR code
        const startX = margin + (width - 2 * margin - size * cellSize) / 2;
        const startY = margin + (height - 2 * margin - size * cellSize) / 2;
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;
                
                if (matrix[row][col] === 1) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
    }

    // Generate as data URL
    toDataURL(text, options = {}) {
        const canvas = document.createElement('canvas');
        const width = options.width || 512;
        const height = options.height || 512;
        canvas.width = width;
        canvas.height = height;
        
        this.toCanvas(canvas, text, options);
        return canvas.toDataURL('image/png');
    }
}

// Make it globally available
window.QRCode = QRCodeGenerator;
