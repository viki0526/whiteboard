import React, { useEffect, useRef } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css'
import io from 'socket.io-client';

export default function TLBoard (props) {
    const socketRef = useRef();
    const tldrawRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:8080');
        const tldrawInstance = tldrawRef.current.getInstance();
        console.log(tldrawInstance);

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

    // useEffect(() => {
    //     setTimeout(() => {
    //         console.log(tldrawRef.current.getCurrentPageShapesSorted())
    //     }, 300)
    // }, [])

    return (
        <Tldraw class="board" id="board" ref={tldrawRef}/>
    );
}