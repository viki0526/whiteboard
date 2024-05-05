import { configureStore } from '@reduxjs/toolkit';
import shapesReducer from './shapeSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, shapesReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);


// export default configureStore({
//     reducer: shapesReducer,
// })
