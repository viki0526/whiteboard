import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addShape, clearShapes, undo } from '../../store/shapeSlice';

export default function Rectangle ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'square') {
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
                const rectangleObject = {left: Math.min(start.x, end.x), top: Math.min(start.y, end.y), width: Math.abs(start.x - end.x), height: Math.abs(start.y - end.y)};
                dispatch(addShape({type: 'rectangle', details: rectangleObject, canvasSettings: canvasSettings}));
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