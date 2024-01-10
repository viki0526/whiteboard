export default class Square {
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
        this.mode = 'square';

    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    static syncDraw(ctx, obj) {
        ctx.beginPath();
        ctx.rect(obj.left, obj.top, obj.width, obj.height);
        ctx.stroke();
        ctx.closePath();
    }

    static drawAll(ctx, objects) {
        objects.forEach(obj => {
            Square.syncDraw(ctx, obj);
        });
    }

    startDrawing (e) {
        this.isDrawing = true;
        [this.initX, this.initY] = [e.offsetX, e.offsetY];
    }

    draw (e) {
        if (!this.isDrawing) return;
        if (this.started) {
            this.storeInstance.redraw();
        }
        [this.currX, this.currY] = [e.offsetX, e.offsetY];
        this.ctx.beginPath();
        const left = Math.min(this.initX, this.currX);
        const top = Math.min(this.initY, this.currY);
        const width = Math.abs(this.initX - this.currX);
        const height = Math.abs(this.initY - this.currY);
        this.ctx.rect(left, top, width, height);
        this.ctx.stroke();
        this.ctx.closePath();
        this.started = true;
    }

    stopDrawing (e) {
        this.ctx.beginPath();
        const left = Math.min(this.initX, this.currX);
        const top = Math.min(this.initY, this.currY);
        const width = Math.abs(this.initX - this.currX);
        const height = Math.abs(this.initY - this.currY);
        this.ctx.rect(left, top, width, height);
        this.ctx.stroke();
        this.ctx.closePath();
        this.isDrawing = false;
        this.started = false;
        this.storeInstance.add({left: left, top: top, width: width, height: height}, this.mode);
    }
}