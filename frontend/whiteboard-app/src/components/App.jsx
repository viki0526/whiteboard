import React, {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';

import '../css/App.css';
import Home from './Home';
import BoardContainer from './BoardContainer';
import Login from './Login';
import Profile from './Profile'
import 'bootstrap/dist/css/bootstrap.min.css';

import NavComponent from './NavComponent'

export default function App () {

    return (
        <>
        <NavComponent />
        <div className='app-container'>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/profile" exact element={<Profile />} />
                <Route path="/whiteboard" exact element={<BoardContainer />} />
            </Routes>
        </div>
        </>
        
    );
}

