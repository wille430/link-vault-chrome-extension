import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducer'

export const createStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
}

export const store = createStore()

export type Store = typeof store
export type RootState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']
