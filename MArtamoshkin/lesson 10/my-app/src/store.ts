import { chatMiddleware } from './middleware/markChatFired';
import { initReducer } from './reducers/index';
import { Store, applyMiddleware, createStore } from "redux";
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { autoResponseMiddleware } from './middleware/autoResponse';

export const history = createBrowserHistory();

const persistConfig = {
    key: 'chat-bot',
    storage,
};

export const initStore = () => {
    const store: Store = createStore(persistReducer(persistConfig, initReducer(history)),
        composeWithDevTools(applyMiddleware(logger, chatMiddleware, autoResponseMiddleware, routerMiddleware(history))));
    const persistor = persistStore(store);
    return { store, persistor };
};