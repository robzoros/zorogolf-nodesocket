import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import rootReducer from './reducer'

// create a logger

const logger = createLogger()
const middleware = [ReduxThunk, logger]

const Store = createStore(rootReducer, {}, applyMiddleware(...middleware))
export default Store
