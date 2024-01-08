export default class Line {
    constructor({ ctx, props }) {
        this.ctx = ctx;
        this.isDrawing = false;
        this.props = props;
        [this.currX, this.currY] = [0, 0];
        [this.initX, this.initY] = [0, 0];
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.strokeWidth;
        this.ctx.globalAlpha = this.props.opacity;
    
        this.startDrawing = this.startDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
    }

    startDrawing (e) {
        console.log("line start");
        this.isDrawing = true;
        [this.initX, this.initY] = [e.offsetX, e.offsetY]
    }

    draw (e) {
        if (!this.isDrawing) return;
        console.log("line draw");
        [this.currX, this.currY] = [e.offsetX, e.offsetY];
        this.ctx.beginPath();
        this.ctx.moveTo(this.initX, this.initY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.stroke();
        this.ctx.closePath();

    }

    stopDrawing (e) {
        console.log("stop draw");
        this.ctx.clearRect(0, 0, 1230, 882);
        this.ctx.beginPath();
        this.ctx.moveTo(this.initX, this.initY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.isDrawing = false;
    }
}