import { createSlice } from '@reduxjs/toolkit'

export const shapesSlice = createSlice({
    name: 'shapes',
    initialState: {
        value: [],
    },
    reducers: {
        redraw: (state) => {
            // Does nothing, triggers change for redraw
            state.value = state.value.slice(0, state.value.length);
        },
        restoreShapes: (state, action) => {
            state.value = action.payload;
        },
        addShape: (state, action) => {
            state.value = [...state.value, action.payload]
        },
        clearShapes: (state) => {
            console.log('clearing');
            state.value = [];
        },
        undo: (state) => {
            if (state.value.length === 0) {
                return;
            }
            state.value = state.value.slice(0, -1);
        }
    },
})

// Action creators are generated for each case reducer function
export const { redraw, restoreShapes, addShape, clearShapes, undo } = shapesSlice.actions

export default shapesSlice.reducer