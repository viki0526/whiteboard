import { useEffect, useRef } from 'react';
import useWhiteboardSession from '../hooks/useWhiteboardSession';


export default function Circle ({ ctx, mode, sessionId, canvasSettings }) {
    const {addShapeToSession, undoShapeFromSession} = useWhiteboardSession(sessionId);
    const isDrawing = useRef(false);
    const start = useRef({});
    const end = useRef({});
    const started = useRef(false);

    useEffect(() => {
        if (ctx && mode === 'circle') {
            const startDrawing = (e) => {
                isDrawing.current = true;
                start.current = { x: e.offsetX, y: e.offsetY };
                end.current = { x: e.offsetX, y: e.offsetY };
            };
        
            const draw = (e) => {
                if (!isDrawing.current) return;
                if (started.current) undoShapeFromSession();
                const radiusX = Math.abs(end.current.x - start.current.x) / 2;
                const radiusY = Math.abs(end.current.y - start.current.y) / 2;
                const centerX = Math.min(end.current.x, start.current.x) + radiusX;
                const centerY = Math.min(end.current.y, start.current.y) + radiusY;
                const circleObject = {centerX: centerX, centerY: centerY, radiusX: radiusX, radiusY: radiusY};
                addShapeToSession({type: 'circle', details: circleObject, canvasSettings: canvasSettings});
                end.current = { x: e.offsetX, y: e.offsetY };
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