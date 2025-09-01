import { combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice  from "./auth/authSlicer";

const persistConfig={
    key:"root",
    storage
}

const persistedReducer = persistReducer(persistConfig, authSlice);

const store=createStore(persistedReducer);
const persistor=persistStore(store);
export {store, persistor}
