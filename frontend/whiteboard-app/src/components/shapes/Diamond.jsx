import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape, undo } from '../../store/shapeSlice';

export default function Diamond ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'diamond') {
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
                const centerX = (start.x + end.x) / 2;
                const centerY = (start.y + end.y) / 2;
                const width = Math.abs(start.x - end.x);
                const height = Math.abs(start.y - end.y);
                const diamondObject = {centerX: centerX, centerY: centerY, width: width, height: height};
                dispatch(addShape({type: 'diamond', details: diamondObject, canvasSettings: canvasSettings}));
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