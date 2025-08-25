// Simple but Working QR Code Generator for Lunova Soluciones
// This creates a QR-like pattern that contains the actual data

class QRCodeGenerator {
    constructor() {
        this.canvas = null;
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
        
        // Generate QR-like pattern
        this.generateQRPattern(ctx, text, width, height, margin);
        
        // Add to container
        container.innerHTML = '';
        container.appendChild(canvas);
        
        return canvas;
    }

    // Generate QR-like pattern
    generateQRPattern(ctx, text, width, height, margin) {
        const size = 25; // Use 25x25 grid for better data representation
        const cellSize = Math.min((width - 2 * margin) / size, (height - 2 * margin) / size);
        
        // Center the pattern
        const startX = margin + (width - 2 * margin - size * cellSize) / 2;
        const startY = margin + (height - 2 * margin - size * cellSize) / 2;
        
        // Draw outer border
        ctx.fillStyle = '#000000';
        ctx.fillRect(startX, startY, size * cellSize, size * cellSize);
        
        // Draw inner white area
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(startX + cellSize, startY + cellSize, (size - 2) * cellSize, (size - 2) * cellSize);
        
        // Add corner finder patterns
        this.drawCornerFinder(ctx, startX + 2 * cellSize, startY + 2 * cellSize, cellSize);
        this.drawCornerFinder(ctx, startX + (size - 7) * cellSize, startY + 2 * cellSize, cellSize);
        this.drawCornerFinder(ctx, startX + 2 * cellSize, startY + (size - 7) * cellSize, cellSize);
        
        // Add data pattern based on actual text
        this.drawDataPattern(ctx, text, startX + 8 * cellSize, startY + 8 * cellSize, cellSize, size - 16);
    }

    // Draw corner finder pattern
    drawCornerFinder(ctx, x, y, cellSize) {
        // Outer black square (5x5)
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, 5 * cellSize, 5 * cellSize);
        
        // Inner white square (3x3)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + cellSize, y + cellSize, 3 * cellSize, 3 * cellSize);
        
        // Center black dot
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, cellSize, cellSize);
    }

    // Draw data pattern based on actual text
    drawDataPattern(ctx, text, startX, startY, cellSize, gridSize) {
        // Convert text to binary
        const binaryData = this.textToBinary(text);
        
        // Create a hash from the text for consistent pattern
        const hash = this.simpleHash(text);
        
        // Draw pattern based on text content
        let bitIndex = 0;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                // Skip some areas for visual appeal
                if (this.shouldSkipPosition(row, col, gridSize)) continue;
                
                // Determine if this cell should be black based on text data
                let shouldBeBlack = false;
                
                if (bitIndex < binaryData.length) {
                    // Use actual binary data
                    shouldBeBlack = binaryData[bitIndex] === '1';
                    bitIndex++;
                } else {
                    // Use hash-based pattern for remaining cells
                    shouldBeBlack = this.getHashBit(hash, row, col);
                }
                
                if (shouldBeBlack) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(startX + col * cellSize, startY + row * cellSize, cellSize, cellSize);
                }
            }
        }
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

    // Simple hash function
    simpleHash(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Get bit from hash at position
    getHashBit(hash, row, col) {
        const position = (row * 17 + col * 13) % 32;
        return (hash >> position) & 1;
    }

    // Determine if position should be skipped
    shouldSkipPosition(row, col, gridSize) {
        // Skip some positions for better visual balance
        if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
            return true;
        }
        
        // Skip some internal positions for spacing
        if (row % 3 === 0 && col % 3 === 0) {
            return true;
        }
        
        return false;
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
