import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist' //redux持久化
import storage from 'redux-persist/lib/storage' //redux持久化
import userListReducer from './reducers/userListReducer'
import userInfoReducer from './reducers/userInfoReducer'
import mainReducer from './reducers/mainReducer'

const persistConfig = {
  key: 'root',
  storage
}

const reducer = combineReducers({
  userListReducer,
  userInfoReducer: persistReducer(persistConfig, userInfoReducer),
  mainReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk)))

export const persistor = persistStore(store)

export default store
