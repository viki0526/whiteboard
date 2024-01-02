import React, {useRef, useState, useEffect} from 'react';
import io from 'socket.io-client';
import '../css/Board.css';

export default function Board (props) {
    const canvasRef = useRef(null);
    const colorRef = useRef(props.color);
    const socketRef = useRef();

    useEffect(() => {
        console.log('rendering');

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = props.color;
        ctx.lineWidth = 0.5;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let isDrawing = false;
        let [lastX, lastY] = [0, 0];

        const startDrawing = (e) => {
            isDrawing = true;
            const X = e.offsetX;
            const Y = e.offsetY;
            ctx.beginPath();
            ctx.moveTo(X, Y);
            [lastX, lastY] = [X, Y];
        };
    
        const draw = (e) => {
            if (!isDrawing) return;
            const X = e.offsetX;
            const Y = e.offsetY;
            ctx.strokeStyle = colorRef.current;
            ctx.lineTo(X, Y);
            ctx.stroke();
            // Emit draw event to socket
            const line = { fromX: lastX, fromY: lastY, X: X, Y: Y, color: ctx.strokeStyle };
            socketRef.current.emit('draw', line);
            [lastX, lastY] = [X, Y];
        };
        
        const stopDrawing = (e) => {
            isDrawing = false;
            ctx.closePath();
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        };
    }, [])

    useEffect(() => {
        colorRef.current = props.color;
    }, [props.color])

    useEffect(() => {
        socketRef.current = io('http://localhost:8080');
        const canvas = canvasRef.current;
        const broadcastCtx = canvas.getContext('2d');

        const draw = (line) => {
            broadcastCtx.beginPath();
            broadcastCtx.strokeStyle = line.color;
            broadcastCtx.moveTo(line.fromX, line.fromY);
            broadcastCtx.lineTo(line.X, line.Y);
            broadcastCtx.stroke();
            broadcastCtx.closePath();
        }

        // Event listeners and logic for the socket connection
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });
    
        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socketRef.current.on('draw', (line) => {
            draw(line);
        });
    
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className='board' id='board'></canvas>
        </>
    );
}