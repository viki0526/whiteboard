import React, {useRef, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import '../css/Board.css';
import useDrawing from '../components/hooks/useDrawing'

import Rectangle from './shapes/Rectangle';
import Draw from './shapes/Draw';
import Diamond from './shapes/Diamond';
import Line from './shapes/Line';
import Circle from './shapes//Circle';

import { useDispatch } from 'react-redux';
import { redraw } from '../store/shapeSlice';

/**
 * 
 * @param {*} props 
 * @returns styled blank canvas element
 * 
 * Wrapper class for drawing canvas. Routes to appropriate canvas function
 */
const Board = (props) => {
    const canvasRef = useRef();
    const [ctx, setCtx] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setCtx(context);
            dispatch(redraw());
        };

        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []); 

    useDrawing(ctx, props.model);

    const settings = {color: props.color, opacity: props.opacity, strokeWidth: props.strokeWidth};

    return (
        <>
            <canvas ref={canvasRef} className='board' id='board'></canvas>
            <Rectangle ctx={ctx} mode={props.mode} canvasSettings={settings} />
            <Diamond ctx={ctx} mode={props.mode} canvasSettings={settings} />
            <Circle ctx={ctx} mode={props.mode} canvasSettings={settings} />
            <Line ctx={ctx} mode={props.mode} canvasSettings={settings} />
            <Draw ctx={ctx} mode={props.mode} canvasSettings={settings} />
        </>
    );
};

export default Board;