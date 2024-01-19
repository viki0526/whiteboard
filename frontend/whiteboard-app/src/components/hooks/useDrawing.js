import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { restoreShapes } from '../../store/shapeSlice';

const useDrawing = (ctx) => {
    const shapes = useSelector((state) => state.value);
    const dispatch = useDispatch();

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
        console.log('loading from localStorage');
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
            case 'diamond':
                drawDiamond(shape.details, shape.canvasSettings);
            case 'draw':
                drawFree(shape.details, shape.canvasSettings);
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
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
        ctx.closePath();
    };

    const drawDiamond = (diamond) => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
        ctx.closePath();
    };

    const drawFree = (free) => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
        ctx.closePath();
    };

    return null;
};

export default useDrawing;
