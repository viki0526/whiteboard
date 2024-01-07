import React, {useRef, useEffect, useState} from 'react';
import io from 'socket.io-client';
import '../css/Board.css';
import Draw from '../functions/Draw';

export default function Board (props) {
    const canvasRef = useRef();
    const propsRef = useRef(props);
    const socketRef = useRef();
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        propsRef.current = props;
    }, [props])

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = props.color;
        ctx.lineWidth = props.lineWidth;
        ctx.globalAlpha = props.opacity
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        return { canvas, ctx };
    }

    useEffect(() => {
        const { canvas, ctx } = initializeCanvas();

        const drawInstance = new Draw({ ctx, propsRef });

        canvas.addEventListener('mousedown', drawInstance.startDrawing);
        canvas.addEventListener('mousemove', drawInstance.draw);
        canvas.addEventListener('mouseup', drawInstance.stopDrawing);
        canvas.addEventListener('mouseout', drawInstance.stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', drawInstance.startDrawing);
            canvas.removeEventListener('mousemove', drawInstance.draw);
            canvas.removeEventListener('mouseup', drawInstance.stopDrawing);
            canvas.removeEventListener('mouseout', drawInstance.stopDrawing);
        };
    }, []);

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