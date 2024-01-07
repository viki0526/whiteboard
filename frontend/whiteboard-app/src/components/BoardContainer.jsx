import React, {useState, useEffect} from 'react';
import '../css/BoardContainer.css';
import Board from './Board'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import {ReactComponent as DragHandIcon} from '../assets/DragHandIcon.svg';
import {ReactComponent as PointerIcon} from '../assets/PointerIcon.svg';
import {ReactComponent as SquareIcon} from '../assets/SquareIcon.svg';
import {ReactComponent as DiamondIcon} from '../assets/DiamondIcon.svg';
import {ReactComponent as EllipseIcon} from '../assets/EllipseIcon.svg';
import {ReactComponent as ArrowIcon} from '../assets/ArrowIcon.svg';
import {ReactComponent as LineIcon} from '../assets/LineIcon.svg';

export default function BoardContainer () {
    const colors = [{name: 'black', code: '#1e1e1e'}, {name: 'red', code: '#e03131'}, {name: 'green', code: '#2f9e44'}, {name: 'blue', code: '#1971c2'}, {name: 'orange', code: '#f08c00'}]

    const toolbarElements = [
        {id: 0, name: 'select', content: <PointerIcon />},
        {id: 1, name: 'square', content: <SquareIcon />},
        {id: 2, name: 'diamond', content: <DiamondIcon />},
        {id: 3, name: 'circle', content: <EllipseIcon />},
        {id: 4, name: 'arrow', content: <ArrowIcon />},
        {id: 5, name: 'draw', content: <LineIcon />},
    ]


    const [selectedColor, setSelectedColor] = useState('#1e1e1e');
    const [strokeWidth, setStrokeWidth] = useState(1.2);
    const [opacity, setOpacity] = useState(1);
    const [selectedCol, setSelectedCol] = useState(0);

    const handleColorSelect = (name, code) => {
        setSelectedColor(code);
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

    const handleStrokeWidthSelect = (className, strokeWidth) => {
        setStrokeWidth(strokeWidth);

        const strokeDivs = document.querySelectorAll('.stroke-option');
        strokeDivs.forEach((div) => {
            if (div.classList.contains(className)) {
                div.classList.add('selected');
            } else {
                div.classList.remove('selected');
            }
        })
    }

    const handleToolbarSelect = (e) => {
        console.log('click', e.target)
        const toolbarDivs = document.querySelectorAll('.toolbar-segment');
        toolbarDivs.forEach((div) => {
            div.classList.remove('selected');
        })
        e.target.classList.add('selected');
    }

    return (
        <>
            <div className='main-container'>
                <Container className='toolbar'>
                    {
                        toolbarElements.map((elem) => (
                            <Col key={elem.id} className={'toolbar-segment' + (selectedCol === elem.id ? ' selected' : '')} onClick={() => setSelectedCol(elem.id)}> 
                                {elem.content}
                            </Col>
                        ))
                    }
                </Container>

                <div className='board-container'>
                    <div className='sidebar'>
                        <div className='option-title'>
                            Stroke color
                        </div>
                        <div className='options'>
                            {
                                colors.map((color) => (
                                    <div className={`option-value option-color ${color.name}`} onClick={() => {handleColorSelect(color.name, color.code)}}>
                                        <div style={{background: color.code}} className='inner-box' />
                                    </div>
                                ))
                            }
                            <div className='space-box' />
                            <input type='color' id='color-input' onChange={(e) => {handleColorSelect('custom', e.target.value)}} />
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
                            <div className='stroke-option thin selected' onClick={() => handleStrokeWidthSelect('thin', 1.2)}>
                                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className='stroke-option medium' onClick={() => handleStrokeWidthSelect('medium', 2.5)}>
                                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className='stroke-option thick' onClick={() => handleStrokeWidthSelect('thick', 5)}>
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
                    <Board color={selectedColor} strokeWidth={strokeWidth} opacity={opacity} mode={toolbarElements[selectedCol].name}/>
                </div>
            </div>
        </>
    );
}