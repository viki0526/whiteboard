// Handles session update logic
import { useState, useEffect } from "react";
import { getDatabase, ref, set, runTransaction, get, onValue } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { addShape, undo, redraw, clearShapes } from '../../store/shapeSlice';

export default function useWhiteboardSession (sessionId) {
    const localShapes = useSelector((state) => state.value);
    // const sessionShapes = getShapesFromSession();
    const [sessionShapes, setSessionShapes] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const db = getDatabase();
        const shapesRef = ref(db, `whiteboards/${sessionId}/shapes`);

        const unsubscribe = onValue(shapesRef, (snapshot) => {
            if (snapshot.exists()) {
                setSessionShapes(snapshot.val() || []);
            } else {
                setSessionShapes([]);
            }
        }, (error) => {
            console.error('Failed to read shapes data:', error);
            setSessionShapes([]);
        });

        return () => {
            unsubscribe(); // This is the correct way to unsubscribe
        };
    }, [sessionId]);

    //Returns the right shapes object
    const getShapes = () => {
        if (sessionId === 'local-playground') {
            return localShapes;
        }
        return sessionShapes;
    }

    const addShapeToSession = (shape) => {
        if (sessionId === 'local-playground') {
            dispatch(addShape(shape));
            return;
        }
        const db = getDatabase();
        const shapesRef = ref(db, `whiteboards/${sessionId}/shapes`);
        runTransaction(shapesRef, (currentShapes) => {
            if (currentShapes === null || currentShapes === undefined) {
                return [shape];
            } else {
                return [...currentShapes, shape];
            }
        }).then((result) => {
            if (result.committed) {
                console.log("Shape added successfully.");
            } else {
                console.log("Shape addition was not committed.");
            }
        }).catch((error) => {
            console.error("Error adding shape to db:", error);
        });
    };
    

    function undoShapeFromSession() {
        if (sessionId === 'local-playground') {
            dispatch(undo());
            return;
        }
        
        const db = getDatabase();
        const shapesRef = ref(db, `whiteboards/${sessionId}/shapes`);
    
        runTransaction(shapesRef, (currentShapes) => {
            if (currentShapes === null) {
                // Handle the case where there is no existing data.
                return [];
            } else if (currentShapes.length > 0) {
                // Remove the last shape
                currentShapes.pop();
                return currentShapes; // Return the modified array to be updated in the database
            } else {
                // No shapes to undo, return undefined to abort the transaction
                return;
            }
        }).then((result) => {
            console.log(result);
            if (result.committed) {
                console.log("Last shape undone successfully.");
            } else {
                console.log("Transaction not committed, possibly no shapes to undo.");
            }
        }).catch((error) => {
            console.error("Failed to undo last shape:", error);
        });
    }

    function redrawSessionShapes() {
        if (sessionId === 'local-playground') {
            dispatch(redraw());
            return;
        }
        const db = getDatabase();
        const redrawRef = ref(db, `whiteboards/${sessionId}/lastRedraw`);

        // We set a timestamp here to trigger an update
        set(redrawRef, new Date().toISOString())
            .then(() => {
                console.log("Triggered redraw for session.");
            })
            .catch((error) => {
                console.error("Error triggering redraw:", error);
            });
    }

    const clearShapesFromSession = () => {
        if (sessionId === 'local-playground') {
            dispatch(clearShapes());
            return;
        }
        const db = getDatabase();
        const shapesRef = ref(db, `whiteboards/${sessionId}/shapes`);
        set(shapesRef, null) // Setting the reference to null to clear the data
            .then(() => {
                console.log("All shapes cleared successfully for sessionId:", sessionId);
            })
            .catch((error) => {
                console.error("Error clearing shapes:", error);
            });
    }


    return { getShapes, addShapeToSession, undoShapeFromSession, redrawSessionShapes, clearShapesFromSession };
}

