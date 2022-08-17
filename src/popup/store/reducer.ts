import { combineReducers } from 'redux'
import { cloudReducer } from '../../shared/store/cloud'

export const rootReducer = combineReducers({
    cloud: cloudReducer,
})
