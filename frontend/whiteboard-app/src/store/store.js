import { configureStore } from '@reduxjs/toolkit'
import shapesReducer from './shapeSlice'

export default configureStore({
    reducer: shapesReducer,
})
