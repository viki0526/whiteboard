import React, {useState, useEffect, useRef} from 'react';
import '../css/BoardContainer.css';
import Board from './Board'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy';

import {ReactComponent as SquareIcon} from '../assets/SquareIcon.svg';
import {ReactComponent as DiamondIcon} from '../assets/DiamondIcon.svg';
import {ReactComponent as EllipseIcon} from '../assets/EllipseIcon.svg';
import {ReactComponent as LineIcon} from '../assets/LineIcon.svg';
import {ReactComponent as DrawIcon} from '../assets/DrawIcon.svg';
import {ReactComponent as ClearIcon} from '../assets/ClearIcon.svg';

import { useDispatch } from 'react-redux';
import { clearShapes } from '../store/shapeSlice';


export default function BoardContainer () {
    const colors = [{name: 'black', code: '#1e1e1e'}, {name: 'red', code: '#e03131'}, {name: 'green', code: '#2f9e44'}, {name: 'blue', code: '#1971c2'}, {name: 'orange', code: '#f08c00'}]

    const toolbarElements = [
        {id: 0, name: 'square', content: <SquareIcon />, tooltip: 'Rectangle'},
        {id: 1, name: 'diamond', content: <DiamondIcon />, tooltip: 'Diamond'},
        {id: 2, name: 'circle', content: <EllipseIcon />, tooltip: 'Circle'},
        {id: 3, name: 'line', content: <LineIcon />, tooltip: 'Line'},
        {id: 4, name: 'draw', content: <DrawIcon />, tooltip: 'Draw'},
    ]
    const [selectedColor, setSelectedColor] = useState('#1e1e1e');
    const [strokeWidth, setStrokeWidth] = useState(1.2);
    const [opacity, setOpacity] = useState(1); // Not used currently
    const [selectedCol, setSelectedCol] = useState(0);

    const boardRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {        
        const colorObj = JSON.parse(localStorage.getItem('selectedColor'));
        const strokeWidthObj = JSON.parse(localStorage.getItem('strokeWidth'));
        const mode = JSON.parse(localStorage.getItem('selectedCol'));
        loadFromLocalStorage(colorObj, handleColorSelect);
        loadFromLocalStorage(strokeWidthObj, handleStrokeWidthSelect);
        loadFromLocalStorage(mode, setSelectedCol);
    }, [])

    const loadFromLocalStorage = (val, handleSelect) => {
        if (val) {
            handleSelect(val);
        }
    }

    const handleColorSelect = (obj) => {
        const name = obj.name;
        const code = obj.code;
        setSelectedColor(code);
        localStorage.setItem('selectedColor', JSON.stringify(obj));
        const colorDivs = document.querySelectorAll('.option-color');
        colorDivs.forEach((div) => {
            if (div.classList.contains(name)) {
                div.classList.add('selected');
            } else {
                div.classList.remove('selected');
            }
        })
        const selectedInput = document.getElementById('color-input');
        selectedInput.value = code;
    }

    const handleStrokeWidthSelect = (obj) => {
        const className = obj.className;
        const strokeWidth = obj.strokeWidth;
        setStrokeWidth(strokeWidth);
        localStorage.setItem('strokeWidth', JSON.stringify(obj));
        const strokeDivs = document.querySelectorAll('.stroke-option');
        strokeDivs.forEach((div) => {
            if (div.classList.contains(className)) {
                div.classList.add('selected');
            } else {
                div.classList.remove('selected');
            }
        })
    }

    const handleModeSelect = (id) => {
        setSelectedCol(id);
        localStorage.setItem('selectedCol', JSON.stringify(id));
    }

    const clearAll = () => {
        dispatch(clearShapes());
    };

    return (
        <>
            <div className='main-container'>
                <Container className='toolbar'>
                    {
                        toolbarElements.map((elem) => (
                            <div>
                                <Tooltip title={elem.tooltip} position="top">
                                    <Col key={elem.id} data-tooltip-content={elem.tooltip} data-tooltip-id={elem.id}
                                        className={'toolbar-segment' + (selectedCol === elem.id ? ' selected' : '')} onClick={() => handleModeSelect(elem.id)}> 
                                        {elem.content}
                                    </Col>
                                </Tooltip>
                            </div>
                            
                        ))
                    }
                    <div className='actions'>
                        <Tooltip title="Clear All" position="top">
                            <Col className='toolbar-segment' onClick={clearAll}>
                                <ClearIcon />
                            </Col>
                        </Tooltip>
                    </div>
                    
                </Container>

                <div className='board-container'>
                    <div className='sidebar'>
                        <div className='option-title'>
                            Stroke color
                        </div>
                        <div className='options'>
                            {
                                colors.map((color) => (
                                    <div className={`option-value option-color ${color.name}`} onClick={() => {handleColorSelect({name: color.name, code: color.code})}}>
                                        <div style={{background: color.code}} className='inner-box' /> 
                                    </div>
                                ))
                            }
                            <div className='space-box' />
                            <input type='color' id='color-input' onChange={(e) => {handleColorSelect({name: 'custom', code: e.target.value})}} />
                        </div>

                        {/* <div className='option-title'>
                            Background color
                        </div>
                        <div className='options'>
                            <div className='option-value'>
                                
                            </div>
                        </div> */}

                        <div className='option-title'>
                            Stroke width
                        </div>
                        <div className='options'>
                            <div className='stroke-option thin selected' onClick={() => handleStrokeWidthSelect({className: 'thin', strokeWidth: 1.2})}>
                                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className='stroke-option medium' onClick={() => handleStrokeWidthSelect({className: 'medium', strokeWidth: 2.5})}>
                                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className='stroke-option thick' onClick={() => handleStrokeWidthSelect({className: 'thick', strokeWidth: 5})}>
                                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                        </div>

                        {/* <div className='option-title' style={{paddingBottom: '0'}}>
                            Opacity
                        </div>
                        <div className='options'>
                            <div className='option-value opacity-slider'>
                                <Form.Range min={0} max={1} value={opacity} step={0.01} onChange={(e) => {setOpacity(e.target.value)}}/>
                            </div>
                        </div> */}

                    </div>
                    <Board ref={boardRef} color={selectedColor} strokeWidth={strokeWidth} opacity={opacity} mode={toolbarElements[selectedCol].name}/>
                </div>
            </div>
        </>
    );
}