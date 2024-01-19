import React, {useRef, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import '../css/Board.css';
import useDrawing from '../components/hooks/useDrawing'

import Rectangle from './shapes/Rectangle';

/**
 * 
 * @param {*} props 
 * @returns styled blank canvas element
 * 
 * Wrapper class for drawing canvas. Routes to appropriate canvas function
 */
const Board = (props) => {
    const canvasRef = useRef();
    // const ctxRef = useRef();
    const [ctx, setCtx] = useState();
    let hookLoaded = false;

    useEffect(() => {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        setCtx(canvasRef.current.getContext("2d"));
    }, []); 

    useDrawing(ctx);
    hookLoaded = true;

    return (
        <>
            <canvas ref={canvasRef} className='board' id='board'></canvas>
            <Rectangle ctx={ctx} mode={props.mode} canvasSettings={props} />
        </>
    );
};

export default Board;