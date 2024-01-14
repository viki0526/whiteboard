import React, {useRef, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import '../css/Board.css';
import Draw from '../functions/Draw';
import Circle from '../functions/Circle';
import Diamond from '../functions/Diamond';
import Line from '../functions/Line';
import Square from '../functions/Square';
import Store from '../store/Store';

/**
 * 
 * @param {*} props 
 * @returns styled blank canvas element
 * 
 * Wrapper class for drawing canvas. Routes to appropriate canvas function
 */
const Board = React.forwardRef((props, ref) => {
    const canvasRef = useRef();
    const ctxRef = useRef();
    const storeRef = useRef();
    const clearCanvasRef = useRef();
    const shapes = {
        draw: Draw,
        square: Square,
        circle: Circle,
        diamond: Diamond,
        line: Line,
        square: Square,
    }

    useEffect(() => {
        ctxRef.current = canvasRef.current.getContext("2d");
        ctxRef.current.strokeStyle = props.color;
        ctxRef.current.lineWidth = props.lineWidth;
        ctxRef.current.globalAlpha = props.opacity
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        const ctx = ctxRef.current;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        storeRef.current = new Store({ ctx, width, height });
        clearCanvasRef.current = clearCanvas;
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const shapeClass = shapes[props.mode];
        const storeInstance = storeRef.current;
        const shapeInstance = new shapeClass({ ctx, props, storeInstance });

        canvas.addEventListener('mousedown', shapeInstance.startDrawing);
        canvas.addEventListener('mousemove', shapeInstance.draw);
        canvas.addEventListener('mouseup', shapeInstance.stopDrawing);
        canvas.addEventListener('mouseout', shapeInstance.stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', shapeInstance.startDrawing);
            canvas.removeEventListener('mousemove', shapeInstance.draw);
            canvas.removeEventListener('mouseup', shapeInstance.stopDrawing);
            canvas.removeEventListener('mouseout', shapeInstance.stopDrawing);
        };
    }, [props]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const storeInstance = storeRef.current;
        storeInstance.clear();
        storeInstance.redraw();
    }

    useImperativeHandle(ref, () => ({
        clearCanvas,
    }));

    return (
        <>
            <canvas ref={canvasRef} className={'board ' + props.mode} id='board'></canvas>
        </>
    );
});

export default Board;