export default class Draw {
    constructor({ ctx, props, storeInstance }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.props = props;
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
        
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    static drawAll(objects) {
        
    }

    startDrawing (e) {
        this.isDrawing = true;
        const X = e.offsetX;
        const Y = e.offsetY;
        this.ctx.beginPath();
        this.ctx.moveTo(X, Y);
    }

    draw (e) {
        if (!this.isDrawing) return;
        const X = e.offsetX;
        const Y = e.offsetY;
        this.ctx.lineTo(X, Y);
        this.ctx.stroke();
        // Emit draw event to socket
        // const line = { fromX: lastX, fromY: lastY, X: X, Y: Y, color: ctx.strokeStyle };
        // socketRef.current.emit('draw', line);
        // [lastX, lastY] = [X, Y];
    }

    stopDrawing (e) {
        this.isDrawing = false;
        this.ctx.closePath();
    }
}
