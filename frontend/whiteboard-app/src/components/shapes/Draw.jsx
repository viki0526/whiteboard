import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape } from '../../store/shapeSlice';

export default function Draw ({ ctx, mode, canvasSettings }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (ctx && mode === 'draw') {
            let isDrawing = false;
            let start = {};
            let strokes = [];

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
                strokes.push({dx: start.x, dy: start.y, pen: 'down'});
            };
        
            const draw = (e) => {
                if (!isDrawing) return;
                const [currX, currY] = [e.offsetX, e.offsetY];
                const dx = currX - start.x;
                const dy = currY - start.y;
                ctx.lineTo(currX, currY);
                ctx.stroke();
                const stroke = {dx: dx, dy: dy, pen: 'down'};
                strokes.push(stroke);
                start = { x: currX, y: currY };
            };
        
            const stopDrawing = (e) => {
                isDrawing = false;
                ctx.closePath();
                // Pop last stroke and change pen to end
                let lastStroke = strokes.pop();
                lastStroke.pen = 'end';
                strokes.push(lastStroke);
                dispatch(addShape({type: 'draw', details: strokes, canvasSettings: canvasSettings, autocomplete: false}));
                strokes = [];
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