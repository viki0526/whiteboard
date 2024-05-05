/**
 * Redraws all the shapes in the store when the store changes
 * Draws autcomplete suggestions
 */

/* global ml5 */

import { useEffect, useState, useRef } from 'react';
import { useMemo } from 'react';
import { restoreShapes, redraw, addShape } from '../../store/shapeSlice';
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import useWhiteboardSession from './useWhiteboardSession';


const useDrawing = (ctx, model, sessionId) => {
    const {getShapes, addShapeToSession, redrawSessionShapes} = useWhiteboardSession(sessionId);
    const shapes = getShapes();

    const [modelChosen, setModelChosen] = useState(true);
    const autocompleteSettings = useRef({color: '#000000', opacity: 1, strokeWidth: 2.5});
    const generatedStrokes = useRef([]); 
    const startX = useRef(0);
    const startY = useRef(0);

    const rnnModel = useMemo(() => {
        if (model === "none") {
            setModelChosen(false);
            return;
        }
        setModelChosen(true);
        return ml5.sketchRNN(model, () => {
            console.log('Model loaded', rnnModel);
        })
    }, [model]);

    useEffect(() => {
        if (ctx && shapes) {
            redrawAllShapes();
        }
    }, [ctx, shapes]);

    // Handles model generation and selection on keystroke
    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === 'ArrowRight') {
                redrawSessionShapes();
            }
            else if (event.key === 'Enter') {
                const genStrokes = [{dx: startX.current, dy: startY.current, pen: 'down'}, ...generatedStrokes.current];
                addShapeToSession({type: 'draw', details: genStrokes, canvasSettings: autocompleteSettings.current, autocomplete: true});
            } else {
                // do nothing
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [ctx]);

    const redrawAllShapes = () => {
        console.log(shapes);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var i = 0; i < shapes.length; i++) {
            drawShape(shapes[i], i === shapes.length - 1);
        }
    };

    const drawShape = (shape, last) => {
        if (last) {
            autocompleteSettings.current = shape.canvasSettings
        }
        setContext(shape.canvasSettings);
        switch (shape.type) {
            case 'rectangle':
                drawRectangle(shape.details);
                break;
            case 'line':
                drawLine(shape.details);
                break;
            case 'circle':
                drawCircle(shape.details);
                break;
            case 'diamond':
                drawDiamond(shape.details);
                break;
            case 'draw':
                drawFree(shape.details, last, shape.autocomplete);
                break;
            default:
                console.warn(`Unknown shape type: ${shape.type}`);
        }
    };

    const setContext = (canvasSettings) => {
        ctx.strokeStyle = canvasSettings.color;
        ctx.lineWidth = canvasSettings.strokeWidth;
        ctx.globalAlpha = canvasSettings.opacity;
    }

    const drawRectangle = (rectangle) => {
        ctx.beginPath();
        ctx.rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
        ctx.stroke();
        ctx.closePath();
    };

    const drawLine = (line) => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
        ctx.closePath();
    };

    const drawCircle = (circle) => {
        ctx.beginPath();
        ctx.ellipse(circle.centerX, circle.centerY, circle.radiusX, circle.radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };

    const drawDiamond = (diamond) => {
        ctx.beginPath();
        ctx.moveTo(diamond.centerX, diamond.centerY - diamond.height / 2); 
        ctx.lineTo(diamond.centerX + diamond.width / 2, diamond.centerY); 
        ctx.lineTo(diamond.centerX, diamond.centerY + diamond.height / 2); 
        ctx.lineTo(diamond.centerX - diamond.width / 2, diamond.centerY);
        ctx.closePath();
        ctx.stroke();
    };

    const drawFree = (strokes, last, autocomplete) => {
        if (strokes.length === 0) return;
        const start = strokes[0];
        var x = start.dx, y = start.dy;
        var i;
        var dx = 0, dy = 0;
        var prevPen = 'down';
        moveToCoord(x, y);
        for (i = 1; i < strokes.length; i++) {
            const stroke = strokes[i];
            dx = stroke.dx;
            dy = stroke.dy;
            if (prevPen === 'down') {
                drawLineWithCoord(x, y, x + dx, y + dy);
            }
            moveToCoord(x + dx, y + dy);
            if (prevPen === 'end') {
                break;
            }
            x += dx;
            y += dy;
            prevPen = stroke.pen;
        }
        // Only autocomplete if last shape and not already an autocompletion
        if (modelChosen && last && !autocomplete) {
            startX.current = x;
            startY.current = y;
            generatedStrokes.current = [];
            autocompleteDrawing(strokes, x, y);
        }
    };

    // Helpers
    function drawLineWithCoord(x1, y1, x2, y2, color) {
        if (color !== undefined) {
            ctx.strokeStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    function moveToCoord(x, y) {
        ctx.moveTo(x, y);
    }

    const autocompleteDrawing = (strokes, endX, endY) => {
        if (!rnnModel) {
            console.log('Model not loaded');
            return;
        }
        const seedStrokes = strokes.slice(1);
        rnnModel.reset();
        console.log('model reset');
        rnnModel.generate(seedStrokes, (error, newStroke) => {
            gotStroke(error, newStroke, endX, endY, 0);
        });
    }
    
    // Recursively generates strokes
    function gotStroke(err, stroke, x, y, count) {
        if (err) {
            console.error(err);
            return;
        }
        handleStroke(stroke, x, y, count);
    }

    function animateStrokes(i, currX, currY, prevPen, selectedColor) {
        if (i >= generatedStrokes.current.length) return;

        moveToCoord(currX, currY);
        const {dx, dy, pen} = generatedStrokes.current[i];
        if (prevPen === 'down') {
            drawLineWithCoord(currX, currY, currX + dx, currY + dy, '#d3d3d3');
        }
        if (pen === 'end') {
            ctx.strokeStyle = selectedColor; // Reset to originial color
            return;
        }
        moveToCoord(currX + dx, currY + dy);
        setTimeout(() => {
            animateStrokes(i + 1, currX + dx, currY + dy, pen, selectedColor);
        }, 10);
    }

    function generateSuggestion() {
        const selectedColor = ctx.strokeStyle;
        animateStrokes(0, startX.current, startY.current, 'down', selectedColor);
    }

    function handleStroke(stroke, currX, currY, count) {
        if (!stroke) {
            console.log('max strokes reached');
            return;
        }
        const {dx, dy, pen} = stroke;
        generatedStrokes.current = [...generatedStrokes.current, stroke];

        if (pen === 'end') {
            generateSuggestion();
            return;
        }
        rnnModel.generate((error, newStroke) => {
            gotStroke(error, newStroke, currX + dx, currY + dy, count + 1);
        });
    }

    return null;
};

export default useDrawing;