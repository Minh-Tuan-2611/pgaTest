import {combineReducers} from 'redux'
import { collapsedtReducer } from './collapsedReducer'
import { componentReducer } from './componentReducer'

const rootReducer = combineReducers({
    componentReducer,
    collapsedtReducer
})

export default rootReducer