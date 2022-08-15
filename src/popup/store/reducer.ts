import { combineReducers } from 'redux'
import { cloudReducer } from './cloud'

export const rootReducer = combineReducers({
    cloud: cloudReducer,
})
