import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist' // imports from redux-persist
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from "redux-thunk";

import reducers  from "./reducers/rootReducer";

const persistConfig = { // configuration object for redux-persist
    key: 'root',
    storage, // define which storage to use
}

const persistedReducer = persistReducer(persistConfig, reducers) // create a persisted reducer

const store = createStore(
    persistedReducer, 
    composeWithDevTools(applyMiddleware(thunk))
);

const  persistor = persistStore(store); // used to create the persisted store, persistor will be used in the next step

export {store, persistor}
