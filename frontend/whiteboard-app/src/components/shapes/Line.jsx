import { useEffect, useRef } from 'react';
import useWhiteboardSession from '../hooks/useWhiteboardSession';


export default function Line ({ ctx, mode, sessionId, canvasSettings }) {
    const {addShapeToSession, undoShapeFromSession} = useWhiteboardSession(sessionId);
    const isDrawing = useRef(false);
    const start = useRef({});
    const end = useRef({});
    const started = useRef(false);


    useEffect(() => {
        if (ctx && mode === 'line') {
            const startDrawing = (e) => {
                isDrawing.current = true;
                start.current = { x: e.offsetX, y: e.offsetY };
            };
        
            const draw = (e) => {
                if (!isDrawing.current) return;
                if (started.current) undoShapeFromSession();
                end.current = { x: e.offsetX, y: e.offsetY };
                const lineObject = {startX: start.current.x, startY: start.current.y, endX: end.current.x, endY: end.current.y};
                addShapeToSession({type: 'line', details: lineObject, canvasSettings: canvasSettings});
                started.current = true;
            };
        
            const stopDrawing = (e) => {
                isDrawing.current = false;
                started.current = false;
            };

            const canvas = ctx.canvas;
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
        
            return () => {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', stopDrawing);
            };
        }
        
    }, [ctx, mode, canvasSettings]);
    
    return null;
}