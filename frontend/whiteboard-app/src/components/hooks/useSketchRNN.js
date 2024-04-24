import { useRef, useEffect } from 'react';
import SketchRNN from '../../lib/sketch_rnn.js'; // Ensure you have the correct import path

const useSketchRNN = (canvasRef, modelConfig) => {
    const model = useRef(null);
    const lastPoint = useRef({ x: null, y: null });
    const modelState = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Load and initialize the model
        async function setupModel() {
            model.current = new SketchRNN(modelConfig);
            await model.current.initialize();
            modelState.current = model.current.zeroState();
        }

        setupModel();

        return () => {
            if (model.current) {
                model.current.dispose();
            }
        };
    }, [canvasRef, modelConfig]);

    const startStroke = ({ x, y }) => {
        lastPoint.current = { x, y };
    };

    const continueStroke = ({ x, y }) => {
        if (lastPoint.current.x != null) {
            const stroke = [x - lastPoint.current.x, y - lastPoint.current.y, 1, 0, 0]; // [dx, dy, pen_down, pen_up, pen_end]
            modelState.current = model.current.update(stroke, modelState.current);
            drawLine(lastPoint.current, { x, y }, canvasRef.current);
            lastPoint.current = { x, y };
        }
    };

    const endStroke = () => {
        const stroke = [0, 0, 0, 1, 0]; // [dx, dy, pen_down, pen_up, pen_end]
        modelState.current = model.current.update(stroke, modelState.current);
        autocompleteDrawing(canvasRef.current);
    };

    const drawLine = (from, to, canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    };

    const autocompleteDrawing = (canvas) => {
        const ctx = canvas.getContext('2d');
        function drawNext() {
            const { dx, dy, pen_down, pen_up, pen_end } = model.current.predict(modelState.current);
            if (pen_end) {
                modelState.current = model.current.zeroState(); // Reset model state
                return;
            }
            const newX = lastPoint.current.x + dx;
            const newY = lastPoint.current.y + dy;
            if (pen_down) {
                drawLine(lastPoint.current, { x: newX, y: newY }, canvas);
            }
            lastPoint.current = { x: newX, y: newY };
            requestAnimationFrame(drawNext);
        }
        drawNext();
    };

    return { startStroke, continueStroke, endStroke };
};

export default useSketchRNN;
