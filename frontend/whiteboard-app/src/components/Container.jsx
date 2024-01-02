import React, {useState, useEffect} from 'react';
import '../css/Container.css';
import Board from './Board'

export default function Container () {
    const [color, setColor] = useState('#000000')

    return (
        <>
            <div className='main-container'>
                <div className='color-picker-container'>
                    <input type='color' onChange={(e) => {setColor(e.target.value)}} />
                </div>
                <div className='board-container'>
                    <Board color={color}/>
                </div>
            </div>
        </>
    );
}