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

    static syncDraw(ctx, obj, props) { 
        ctx.strokeStyle = props.color;
        ctx.lineWidth = props.strokeWidth;
        ctx.globalAlpha = props.opacity;
        ctx.beginPath();
        ctx.moveTo(obj.initX, obj.initY);
        ctx.lineTo(obj.endX, obj.endY);
        ctx.stroke();
        ctx.closePath();
    }

    static drawAll(ctx, objects) {
        objects.forEach(obj => {
            Line.syncDraw(ctx, obj.object, obj.props);
        });
    }

    setContext() {
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
    }

    drawShape(obj) {
        this.setContext();
        this.ctx.beginPath();
        this.ctx.moveTo(obj.initX, obj.initY);
        this.ctx.lineTo(obj.currX, obj.currY);
        this.ctx.stroke();
        this.ctx.closePath();
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
        this.drawShape({initX: this.initX, initY: this.initY, currX: this.currX, currY: this.currY});
        this.started = true;
    }

    stopDrawing (e) {
        const finalPath = {initX: this.initX, initY: this.initY, endX: this.currX, endY: this.currY}
        this.drawShape(finalPath);
        this.storeInstance.add(finalPath, 
            this.props,
            this.mode);
        this.isDrawing = false;
        this.started = false;
    }
}