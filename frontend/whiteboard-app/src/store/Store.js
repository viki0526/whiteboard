/**
 * Stores stack of different drawn objects for redrawing
 * @param ctx, width, height
 */
import Draw from '../functions/Draw';
import Circle from '../functions/Circle';
import Diamond from '../functions/Diamond';
import Line from '../functions/Line';
import Square from '../functions/Square';
import io from 'socket.io-client';

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
        this.loadFromLocalStorage(); 
        this.socket = io('http://localhost:8080', {
            timeout: 20000,
        });
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        this.socket.on('connect_error', (err) => {
            console.error('Connection error:', err); // Handle the connection error here
        });
        this.socket.on('sync', (msg) => {
            const Func = this.functions[msg.mode];
            Func.syncDraw(this.ctx, msg.object, msg.props);
            this.objects[msg.mode].push({object: msg.object, props: msg.props});
        })
        this.add = this.add.bind(this);
    }

    saveToLocalStorage() {
        localStorage.setItem('objects', JSON.stringify(this.objects));
    }

    loadFromLocalStorage() {
        const storedObjects = localStorage.getItem('objects');
        if (storedObjects) {
            this.objects = JSON.parse(storedObjects);
            this.redraw();
        }
    }

    add(object, props, mode) {
        this.objects[mode].push({object: object, props: props});
        this.socket.emit('sync', {object: object, mode: mode, props: props});
        this.saveToLocalStorage();
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        Object.keys(this.objects).forEach(key => {
            const Func = this.functions[key];
            Func.drawAll(this.ctx, this.objects[key]);
        })
    }
}