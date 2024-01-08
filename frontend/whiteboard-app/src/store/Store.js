/**
 * Stores stack of different drawn objects for redrawing
 * @param ctx, width, height
 */
import Draw from '../functions/Draw';
import Circle from '../functions/Circle';
import Diamond from '../functions/Diamond';
import Line from '../functions/Line';
import Square from '../functions/Square';
export default class Store {
    constructor({ ctx, width, height }) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.objects = {
            square: [],
            diamond: [],
            circle: [],
            line: [],
            draw: [],
        };
        this.functions = {
            square: Square,
            diamond: Diamond,
            circle: Circle,
            line: Line,
            draw: Draw,
        }

        this.add = this.add.bind(this);
    }

    add(object, mode) {
        this.objects[mode].push(object);
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        console.log('cleared')
        Object.keys(this.objects).forEach(key => {
            const Func = this.functions[key];
            Func.drawAll(this.ctx, this.objects[key]);
        })
    }
}