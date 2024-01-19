import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape } from '../../store/shapeSlice';

export default function Draw ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'draw') {
            let isDrawing = false;
            let start = {};
            let pathStore = [];

            const setContext = (canvasSettings) => {
                ctx.strokeStyle = canvasSettings.color;
                ctx.lineWidth = canvasSettings.strokeWidth;
                ctx.globalAlpha = canvasSettings.opacity;
            }

            setContext(canvasSettings);

            const startDrawing = (e) => {
                isDrawing = true;
                start = { x: e.offsetX, y: e.offsetY };
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
            };
        
            const draw = (e) => {
                if (!isDrawing) return;
                const [currX, currY] = [e.offsetX, e.offsetY];
                const drawObject = {startX: start.x, startY: start.y, endX: currX, endY: currY};
                ctx.lineTo(drawObject.endX, drawObject.endY);
                ctx.stroke();
                pathStore.push(drawObject);
                start = { x: currX, y: currY };
            };
        
            const stopDrawing = (e) => {
                isDrawing = false;
                ctx.closePath();
                dispatch(addShape({type: 'draw', details: pathStore, canvasSettings: canvasSettings}))
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