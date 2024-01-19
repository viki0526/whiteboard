import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape, undo } from '../../store/shapeSlice';

export default function Circle ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'circle') {
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
                const radiusX = Math.abs(end.x - start.x) / 2;
                const radiusY = Math.abs(end.y - start.y) / 2;
                const centerX = Math.min(end.x, start.x) + radiusX;
                const centerY = Math.min(end.y, start.y) + radiusY;
                const circleObject = {centerX: centerX, centerY: centerY, radiusX: radiusX, radiusY: radiusY};
                dispatch(addShape({type: 'circle', details: circleObject, canvasSettings: canvasSettings}));
                end = { x: e.offsetX, y: e.offsetY };
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