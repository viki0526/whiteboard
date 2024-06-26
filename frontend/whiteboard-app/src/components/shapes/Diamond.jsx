import { useEffect, useRef } from 'react';
import useWhiteboardSession from '../hooks/useWhiteboardSession';


export default function Diamond ({ ctx, mode, sessionId, canvasSettings }) {
    const {addShapeToSession, undoShapeFromSession} = useWhiteboardSession(sessionId);
    const isDrawing = useRef(false);
    const start = useRef({});
    const end = useRef({});
    const started = useRef(false);

    useEffect(() => {
        if (ctx && mode === 'diamond') {
            const startDrawing = (e) => {
                isDrawing.current = true;
                start.current = { x: e.offsetX, y: e.offsetY };
            };
        
            const draw = (e) => {
                if (!isDrawing.current) return;
                if (started.current) undoShapeFromSession();
                end.current = { x: e.offsetX, y: e.offsetY };
                const centerX = (start.current.x + end.current.x) / 2;
                const centerY = (start.current.y + end.current.y) / 2;
                const width = Math.abs(start.current.x - end.current.x);
                const height = Math.abs(start.current.y - end.current.y);
                const diamondObject = {centerX: centerX, centerY: centerY, width: width, height: height};
                addShapeToSession({type: 'diamond', details: diamondObject, canvasSettings: canvasSettings});
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