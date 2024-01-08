export default class Line {
    constructor({ ctx, props, storeInstance }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.props = props;
        this.storeInstance = storeInstance;
        this.started = false;
        [this.currX, this.currY] = [0, 0];
        [this.initX, this.initY] = [0, 0];
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
        this.mode = 'line';

    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    static drawAll(ctx, objects) {
        
    }

    startDrawing (e) {
        console.log("line start");
        this.isDrawing = true;
        [this.initX, this.initY] = [e.offsetX, e.offsetY];
    }

    draw (e) {
        if (!this.isDrawing) return;
        console.log("line draw");
        if (this.started) {
            this.storeInstance.popLast('line');
            this.storeInstance.redraw();
        }
        [this.currX, this.currY] = [e.offsetX, e.offsetY];
        this.storeInstance.add({initX: this.initX, initY: this.initY, endX: this.currX, endY: this.currY}, this.mode);
        this.ctx.beginPath();
        this.ctx.moveTo(this.initX, this.initY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.started = true;
    }

    stopDrawing (e) {
        console.log("stop draw");
        this.ctx.beginPath();
        this.ctx.moveTo(this.initX, this.initY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.isDrawing = false;
        this.started = false;
    }
}