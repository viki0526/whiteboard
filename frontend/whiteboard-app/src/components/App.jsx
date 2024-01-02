import React, {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';

import '../css/App.css';
import Home from './Home';
import Container from './Container';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavComponent from './NavComponent'

export default function App () {

    return (
        <>
        <NavComponent />
        <div className='app-container'>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/container" exact element={<Container />} />
            </Routes>
        </div>
        </>
        
    );
}

