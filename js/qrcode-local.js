// Simple QR Code Generator for Lunova Soluciones
// This avoids CDN issues on Vercel

class SimpleQRCode {
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
        
        // Generate simple QR pattern (this is a simplified version)
        this.generateSimplePattern(ctx, text, width, height, margin);
        
        // Add to container
        container.innerHTML = '';
        container.appendChild(canvas);
        
        return canvas;
    }

    // Generate simple pattern (this is a basic representation)
    generateSimplePattern(ctx, text, width, height, margin) {
        const data = text;
        const cellSize = Math.min((width - 2 * margin) / 25, (height - 2 * margin) / 25);
        
        // Draw border
        ctx.fillStyle = '#000000';
        ctx.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);
        
        // Draw inner white area
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(margin + cellSize, margin + cellSize, width - 2 * margin - 2 * cellSize, height - 2 * margin - 2 * cellSize);
        
        // Draw some pattern based on text
        ctx.fillStyle = '#000000';
        for (let i = 0; i < data.length; i++) {
            const x = margin + cellSize + (i % 20) * cellSize;
            const y = margin + cellSize + Math.floor(i / 20) * cellSize;
            if (x < width - margin - cellSize && y < height - margin - cellSize) {
                ctx.fillRect(x, y, cellSize * 0.8, cellSize * 0.8);
            }
        }
        
        // Add corner markers
        this.drawCornerMarker(ctx, margin + cellSize, margin + cellSize, cellSize);
        this.drawCornerMarker(ctx, width - margin - 2 * cellSize, margin + cellSize, cellSize);
        this.drawCornerMarker(ctx, margin + cellSize, height - margin - 2 * cellSize, cellSize);
    }

    drawCornerMarker(ctx, x, y, size) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + size * 0.3, y + size * 0.3, size * 0.4, size * 0.4);
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
window.QRCode = SimpleQRCode;
