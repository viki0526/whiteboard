export default class Draw {
    constructor({ ctx, propsRef }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.propsRef = propsRef;
    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    startDrawing (e) {
        console.log('startDrawing');
        this.isDrawing = true;
        console.log(this.isDrawing)
        const X = e.offsetX;
        const Y = e.offsetY;
        this.ctx.beginPath();
        this.ctx.moveTo(X, Y);
    }

    draw (e) {
        if (!this.isDrawing) return;
        console.log('draw');
        const X = e.offsetX;
        const Y = e.offsetY;
        this.ctx.strokeStyle = this.propsRef.current.color;
        this.ctx.lineWidth = this.propsRef.current.strokeWidth;
        this.ctx.globalAlpha = this.propsRef.current.opacity;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineTo(X, Y);
        this.ctx.stroke();
        // Emit draw event to socket
        // const line = { fromX: lastX, fromY: lastY, X: X, Y: Y, color: ctx.strokeStyle };
        // socketRef.current.emit('draw', line);
        // [lastX, lastY] = [X, Y];
    }
    
    stopDrawing (e) {
        console.log('stopDrawing');
        this.isDrawing = false;
        this.ctx.closePath();
    }
}
