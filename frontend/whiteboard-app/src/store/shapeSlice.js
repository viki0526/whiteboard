import { createSlice } from '@reduxjs/toolkit'

export const shapesSlice = createSlice({
    name: 'shapes',
    initialState: {
        value: [],
    },
    reducers: {
        restoreShapes: (state, action) => {
            state.value = action.payload;
        },
        addShape: (state, action) => {
            state.value = [...state.value, action.payload]
            // console.log(state.value);
        },
        clearShapes: (state) => {
            state.value = []
        },
        undo: (state) => {
            state.value = state.value.slice(0, -1);
        }
    },
})

// Action creators are generated for each case reducer function
export const { restoreShapes, addShape, clearShapes, undo } = shapesSlice.actions

export default shapesSlice.reducer