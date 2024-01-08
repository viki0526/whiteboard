export default class Circle {
    constructor({ ctx, props, storeInstance }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.props = props;
        this.storeInstance = storeInstance;
        this.started = false;
        this.start = {};
        this.end = {};
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
        this.mode = 'circle';
        this.started = false;

    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    static drawAll(ctx, objects) {
        objects.forEach(obj => {
            ctx.beginPath();
            ctx.ellipse(obj.centerX, obj.centerY, obj.radiusX, obj.radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        });
    }

    startDrawing (e) {
        console.log('circle start');
        this.isDrawing = true;
        this.start = { x: e.offsetX, y: e.offsetY };
        this.end = { x: e.offsetX, y: e.offsetY };
    }

    draw (e) {
        if (!this.isDrawing) return;
        console.log(this.start, this.end);
        if (this.started) {
            this.storeInstance.redraw();
        }
        const radiusX = Math.abs(this.end.x - this.start.x) / 2;
        const radiusY = Math.abs(this.end.y - this.start.y) / 2;
        const centerX = Math.min(this.end.x, this.start.x) + radiusX;
        const centerY = Math.min(this.end.y, this.start.y) + radiusY;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
        this.end = { x: e.offsetX, y: e.offsetY };
        this.started = true;
    }

    stopDrawing (e) {
        console.log('circle stop');
        const finalRadiusX = Math.abs(this.end.x - this.start.x) / 2;
        const finalRadiusY = Math.abs(this.end.y - this.start.y) / 2;
        const finalCenterX = Math.min(this.end.x, this.start.x) + finalRadiusX;
        const finalCenterY = Math.min(this.end.y, this.start.y) + finalRadiusY;
        this.storeInstance.add({centerX: finalCenterX, centerY: finalCenterY, radiusX: finalRadiusX, radiusY: finalRadiusY}, this.mode);
        this.isDrawing = false;
        this.started = false;
    }
}