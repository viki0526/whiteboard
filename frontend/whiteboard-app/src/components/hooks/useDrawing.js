/**
 * Redraws all the shapes in the store when the store changes
 * Saves to localStorage to persist state on refresh
 */

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { restoreShapes } from '../../store/shapeSlice';

const useDrawing = (ctx) => {
    const MAX_STROKES = 200;
    const shapes = useSelector((state) => state.value);
    const dispatch = useDispatch();

    // For sketch-rnn autocomplete
    let previousPen = 'down';

    const rnnModel = useMemo(() => {
        return ml5.sketchRNN('book', () => {
            console.log('Model loaded', rnnModel);
        })
    }, []);


    useEffect(() => {
        if (ctx) {
            loadFromLocalStorage();
        }
    }, [ctx]);

    useEffect(() => {
        if (ctx) {
            redrawAllShapes();
            saveToLocalStorage();
        }
    }, [shapes]);

    const loadFromLocalStorage = () => {
        const storedShapesJson = localStorage.getItem('shapes');
        if (storedShapesJson) {
            const storedShapes = JSON.parse(storedShapesJson);
            dispatch(restoreShapes(storedShapes));
        }
    }

    const saveToLocalStorage = () => {
        localStorage.setItem('shapes', JSON.stringify(shapes));
    }

    const redrawAllShapes = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) => {
            drawShape(shape);
        });
    };

    const drawShape = (shape) => {
        setContext(shape.canvasSettings);
        switch (shape.type) {
            case 'rectangle':
                drawRectangle(shape.details, shape.canvasSettings);
                break;
            case 'line':
                drawLine(shape.details, shape.canvasSettings);
                break;
            case 'circle':
                drawCircle(shape.details, shape.canvasSettings);
                break;
            case 'diamond':
                drawDiamond(shape.details, shape.canvasSettings);
                break;
            case 'draw':
                drawFree(shape.details, shape.canvasSettings);
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

    const drawFree = (strokes) => {
        ctx.beginPath();
        var x = 0, y = 0;
        var i;
        var dx, dy;
        for (i = 0; i < strokes.length; i++) {
            const stroke = strokes[i];
            if (stroke.pen == 'up') {
                x = stroke.dx;
                y = stroke.dy;
                ctx.moveTo(x, y);
            } else if (stroke.pen == 'down') {
                dx = stroke.dx;
                dy = stroke.dy;
                ctx.moveTo(x, y);
                ctx.lineTo(x + dx , y + dy);
                ctx.stroke();
                x += dx;
                y += dy;
            } else {
                break;
            }
        }
        ctx.closePath();

        autocompleteDrawing(strokes, x, y);
    };

    // Helpers
    function drawLineWithCoord(x1, y1, x2, y2) {
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
        const seedStrokes = strokes.slice(1); // First stroke is the starting point
        rnnModel.reset();
        rnnModel.generate(seedStrokes, (error, newStroke) => {
            gotStroke(error, newStroke, endX, endY, 0);
        });
    }
    
    // Recursively generates and draws strokes
    function gotStroke(err, stroke, x, y, count) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Generated stroke:', stroke);
        handleStroke(stroke, x, y, count);
    }

    function handleStroke(stroke, currX, currY, count) {
        if (!stroke) {
            console.log('max strokes reached');
            return;
        }
        const {dx, dy, pen} = stroke;

        if (previousPen === 'down') {
            drawLineWithCoord(currX, currY, currX + dx, currY + dy);
        }
        moveToCoord(currX + dx, currY + dy);
        previousPen = pen;

        if (pen !== 'end') {
            rnnModel.generate((error, newStroke) => {
                gotStroke(error, newStroke, currX + dx, currY + dy, count + 1);
            });
        }
    }

    return null;
};

export default useDrawing;
