import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape, undo } from '../../store/shapeSlice';

export default function Line ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'line') {
            let isDrawing = false;
            let started = false;
            let start = {};
            let end = {};

            const startDrawing = (e) => {
                isDrawing = true;
                start = { x: e.offsetX, y: e.offsetY };
            };
        
            const draw = (e) => {
                if (!isDrawing) return;
                if (started) dispatch(undo());
                end = { x: e.offsetX, y: e.offsetY };
                const lineObject = {startX: start.x, startY: start.y, endX: end.x, endY: end.y};
                dispatch(addShape({type: 'line', details: lineObject, canvasSettings: canvasSettings}));
                started = true;
            };
        
            const stopDrawing = (e) => {
                isDrawing = false;
                started = false;
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