import React, {useRef, useEffect, useState} from 'react';
import io from 'socket.io-client';
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
export default function Board (props) {
    const canvasRef = useRef();
    const ctxRef = useRef();
    const storeRef = useRef();
    const socketRef = useRef();
    const toolTipFeatures = {
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
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const tooltip = toolTipFeatures[props.mode];
        const storeInstance = storeRef.current;
        const toolTipInstance = new tooltip({ ctx, props, storeInstance });

        canvas.addEventListener('mousedown', toolTipInstance.startDrawing);
        canvas.addEventListener('mousemove', toolTipInstance.draw);
        canvas.addEventListener('mouseup', toolTipInstance.stopDrawing);
        canvas.addEventListener('mouseout', toolTipInstance.stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', toolTipInstance.startDrawing);
            canvas.removeEventListener('mousemove', toolTipInstance.draw);
            canvas.removeEventListener('mouseup', toolTipInstance.stopDrawing);
            canvas.removeEventListener('mouseout', toolTipInstance.stopDrawing);
        };
    }, [props]);

    // let isDrawing = false;
    // let [lastX, lastY] = [0, 0];

    // useEffect(() => {
    //     socketRef.current = io('http://localhost:8080');
    //     const canvas = canvasRef.current;
    //     const broadcastCtx = canvas.getContext('2d');

    //     const draw = (line) => {
    //         broadcastCtx.beginPath();
    //         broadcastCtx.strokeStyle = line.color;
    //         broadcastCtx.lineWidth = 150;
    //         broadcastCtx.moveTo(line.fromX, line.fromY);
    //         broadcastCtx.lineTo(line.X, line.Y);
    //         broadcastCtx.stroke();
    //         broadcastCtx.closePath();
    //     }

    //     // Event listeners and logic for the socket connection
    //     socketRef.current.on('connect', () => {
    //         console.log('Connected to server');
    //     });
    
    //     socketRef.current.on('disconnect', () => {
    //         console.log('Disconnected from server');
    //     });

    //     socketRef.current.on('draw', (line) => {
    //         draw(line);
    //     });
    
    //     return () => {
    //         socketRef.current.disconnect();
    //     };
    // }, []);

    return (
        <>
            <canvas ref={canvasRef} className={'board ' + props.mode} id='board'></canvas>
        </>
    );
}