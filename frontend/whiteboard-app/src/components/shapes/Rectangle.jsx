import { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { addShape, undo } from '../../store/shapeSlice';

export default function Rectangle ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();
    const isDrawing = useRef(false);
    const start = useRef({});
    const end = useRef({});
    const started = useRef(false);


    useEffect(() => {
        if (ctx && mode === 'square') {
            const startDrawing = (e) => {
                isDrawing.current = true;
                start.current = { x: e.offsetX, y: e.offsetY };
            };
        
            const draw = (e) => {
                if (!isDrawing.current) return;
                if (started.current) dispatch(undo());
                end.current = { x: e.offsetX, y: e.offsetY };
                const rectangleObject = {left: Math.min(start.current.x, end.current.x), top: Math.min(start.current.y, end.current.y), 
                                        width: Math.abs(start.current.x - end.current.x), height: Math.abs(start.current.y - end.current.y)};
                dispatch(addShape({type: 'rectangle', details: rectangleObject, canvasSettings: canvasSettings}));
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