export default class Draw {
    constructor({ ctx, props, storeInstance }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.props = props;
        this.storeInstance = storeInstance;
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
        [this.lastX, this.lastY] = [0, 0]
        this.pathStore = []
        
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    static syncDraw(ctx, obj, props) {
        ctx.strokeStyle = props.color;
        ctx.lineWidth = props.strokeWidth;
        ctx.globalAlpha = props.opacity;
        obj.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.initX, line.initY);
            ctx.lineTo(line.endX, line.endY);
            ctx.stroke();
            ctx.closePath();
        })
    }

    static drawAll(ctx, objects) {
        objects.forEach(obj => {
            Draw.syncDraw(ctx, obj.object, obj.props);
        });
    }

    setContext() {
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
    }

    drawShape(obj) {
        this.setContext();
        this.ctx.lineTo(obj.X, obj.Y);
        this.ctx.stroke();
    }

    startDrawing (e) {
        this.isDrawing = true;
        const X = e.offsetX;
        const Y = e.offsetY;
        this.ctx.beginPath();
        this.ctx.moveTo(X, Y);
        [this.lastX, this.lastY] = [X, Y];
    }

    draw (e) {
        if (!this.isDrawing) return;
        const X = e.offsetX;
        const Y = e.offsetY;
        this.drawShape({X: X, Y: Y});
        this.pathStore.push({initX: this.lastX, initY: this.lastY, endX: X, endY: Y});
        [this.lastX, this.lastY] = [X, Y];
    }

    stopDrawing (e) {
        this.isDrawing = false;
        this.ctx.closePath();
        this.storeInstance.add(this.pathStore, this.props, 'draw');
    }
}
