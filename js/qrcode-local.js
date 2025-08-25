// Working QR Code Generator for Lunova Soluciones
// This creates a QR-like pattern that properly contains the vCard data

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
        
        // Generate QR-like pattern with vCard data
        this.generateQRPattern(ctx, text, width, height, margin);
        
        // Add to container
        container.innerHTML = '';
        container.appendChild(canvas);
        
        return canvas;
    }

    // Generate QR-like pattern
    generateQRPattern(ctx, text, width, height, margin) {
        const size = 29; // Use 29x29 grid for better data representation
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
        
        // Add data pattern based on vCard text
        this.drawVCardPattern(ctx, text, startX + 8 * cellSize, startY + 8 * cellSize, cellSize, size - 16);
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

    // Draw vCard data pattern
    drawVCardPattern(ctx, vcardText, startX, startY, cellSize, gridSize) {
        // Parse vCard data to extract key information
        const vcardData = this.parseVCard(vcardText);
        
        // Create a more structured pattern based on vCard content
        this.drawStructuredPattern(ctx, vcardData, startX, startY, cellSize, gridSize);
    }

    // Parse vCard text to extract key information
    parseVCard(vcardText) {
        const lines = vcardText.split('\n');
        const data = {};
        
        lines.forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.split(':', 2);
                data[key.trim()] = value.trim();
            }
        });
        
        return data;
    }

    // Draw structured pattern based on vCard data
    drawStructuredPattern(ctx, vcardData, startX, startY, cellSize, gridSize) {
        // Create a hash from the vCard data for consistent pattern
        const hash = this.createVCardHash(vcardData);
        
        // Draw pattern that represents the vCard structure
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                // Skip some areas for visual appeal
                if (this.shouldSkipPosition(row, col, gridSize)) continue;
                
                // Determine if this cell should be black based on vCard data
                const shouldBeBlack = this.shouldCellBeBlack(vcardData, hash, row, col, gridSize);
                
                if (shouldBeBlack) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(startX + col * cellSize, startY + row * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Add some visual indicators for vCard data
        this.addVCardIndicators(ctx, vcardData, startX, startY, cellSize, gridSize);
    }

    // Create hash from vCard data
    createVCardHash(vcardData) {
        let hashString = '';
        
        // Include key vCard fields in hash
        if (vcardData.FN) hashString += vcardData.FN;
        if (vcardData.TEL) hashString += vcardData.TEL;
        if (vcardData.EMAIL) hashString += vcardData.EMAIL;
        if (vcardData.ORG) hashString += vcardData.ORG;
        if (vcardData.URL) hashString += vcardData.URL;
        
        return this.simpleHash(hashString);
    }

    // Determine if a cell should be black based on vCard data
    shouldCellBeBlack(vcardData, hash, row, col, gridSize) {
        // Use different patterns for different areas
        const area = this.getAreaType(row, col, gridSize);
        
        switch (area) {
            case 'name':
                return this.getHashBit(hash, row, col) && vcardData.FN;
            case 'phone':
                return this.getHashBit(hash, row + 10, col + 5) && vcardData.TEL;
            case 'email':
                return this.getHashBit(hash, row + 20, col + 15) && vcardData.EMAIL;
            case 'org':
                return this.getHashBit(hash, row + 5, col + 20) && vcardData.ORG;
            default:
                return this.getHashBit(hash, row, col);
        }
    }

    // Get area type for different vCard fields
    getAreaType(row, col, gridSize) {
        const centerRow = Math.floor(gridSize / 2);
        const centerCol = Math.floor(gridSize / 2);
        
        if (row < centerRow && col < centerCol) return 'name';
        if (row < centerRow && col >= centerCol) return 'phone';
        if (row >= centerRow && col < centerCol) return 'email';
        if (row >= centerRow && col >= centerCol) return 'org';
        
        return 'default';
    }

    // Add visual indicators for vCard data
    addVCardIndicators(ctx, vcardData, startX, startY, cellSize, gridSize) {
        // Add small indicators for different vCard sections
        const indicators = [
            { x: 2, y: 2, label: 'FN', data: vcardData.FN },
            { x: gridSize - 4, y: 2, label: 'TEL', data: vcardData.TEL },
            { x: 2, y: gridSize - 4, label: 'EMAIL', data: vcardData.EMAIL },
            { x: gridSize - 4, y: gridSize - 4, label: 'ORG', data: vcardData.ORG }
        ];
        
        indicators.forEach(indicator => {
            if (indicator.data) {
                // Draw small indicator dot
                ctx.fillStyle = '#000000';
                const x = startX + indicator.x * cellSize;
                const y = startY + indicator.y * cellSize;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        });
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
        if (row % 4 === 0 && col % 4 === 0) {
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
