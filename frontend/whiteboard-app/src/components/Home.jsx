import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, push, set } from "firebase/database";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

export default function Home () {
    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    function createSession() {
        const db = getDatabase();
        const whiteboardRef = ref(db, 'whiteboards');
        const newWhiteboardRef = push(whiteboardRef);
        set(newWhiteboardRef, {
            creator: currentUser.uid,
            participants: {
                [currentUser.uid]: true
            },
            shapes: []
        });
        console.log(generateJoinLink(newWhiteboardRef.key));
        // Add session to realtime db
        // dispatch(addSession({sessionId: newWhiteboardRef.key}));
        navigate(`/whiteboard?session-id=${newWhiteboardRef.key}`);
    }

    function generateJoinLink(sessionId) {
        const host = window.location.hostname;
        return `${host}/whiteboard?session-id=${sessionId}`;
    }

    return (
        <>
            <h1>Home Page</h1>
            { currentUser && 
                <Button onClick={createSession}>
                    Create collaborative session
                </Button>
            }
        </>
    );
}