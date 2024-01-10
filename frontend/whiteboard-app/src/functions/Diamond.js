export default class Diamond {
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
        this.mode = 'diamond';

    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.drawShape = this.drawShape.bind(this);
    }

    static syncDraw(ctx, obj) {
        ctx.beginPath();
        ctx.moveTo(obj.centerX, obj.centerY - obj.height / 2); // Top
        ctx.lineTo(obj.centerX + obj.width / 2, obj.centerY); // Right
        ctx.lineTo(obj.centerX, obj.centerY + obj.height / 2); // Bottom
        ctx.lineTo(obj.centerX - obj.width / 2, obj.centerY); // Left
        ctx.closePath();
        ctx.stroke();
        ctx.closePath();
    }

    static drawAll(ctx, objects) {
        objects.forEach(obj => {
            Diamond.syncDraw(ctx, obj);
        });
    }

    drawShape(obj) {
        this.ctx.beginPath();
        this.ctx.moveTo(obj.centerX, obj.centerY - obj.height / 2); // Top
        this.ctx.lineTo(obj.centerX + obj.width / 2, obj.centerY); // Right
        this.ctx.lineTo(obj.centerX, obj.centerY + obj.height / 2); // Bottom
        this.ctx.lineTo(obj.centerX - obj.width / 2, obj.centerY); // Left
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    startDrawing (e) {
        this.isDrawing = true;
        this.start = { x: e.offsetX, y: e.offsetY };
        this.end = { x: e.offsetX, y: e.offsetY };
    }

    draw (e) {
        if (!this.isDrawing) return;
        if (this.started) {
            this.storeInstance.redraw();
        }
        this.end = { x: e.offsetX, y: e.offsetY };
        this.ctx.beginPath();
        const centerX = (this.start.x + this.end.x) / 2;
        const centerY = (this.start.y + this.end.y) / 2;
        const width = Math.abs(this.start.x - this.end.x);
        const height = Math.abs(this.start.y - this.end.y);
        this.drawShape({centerX: centerX, centerY: centerY, width: width, height: height});
        this.started = true;
    }

    stopDrawing (e) {
        const centerX = (this.start.x + this.end.x) / 2;
        const centerY = (this.start.y + this.end.y) / 2;
        const width = Math.abs(this.start.x - this.end.x);
        const height = Math.abs(this.start.y - this.end.y);
        this.drawShape({centerX: centerX, centerY: centerY, width: width, height: height});
        this.isDrawing = false;
        this.started = false;
        this.storeInstance.add(
            {
                centerX: centerX,
                centerY: centerY,
                width: width,
                height: height,
            },
            this.mode
        );
    }
}