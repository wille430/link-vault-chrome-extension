import { createSlice } from '@reduxjs/toolkit'
import { setCloudConnectionState, setCloudLoaded, setCloudSyncState } from './creators'
import { CloudState } from './types'

const initialState: CloudState = {
    isSyncing: false,
    isConnected: false,
    isLoaded: false,
}

export const cloudSlice = createSlice({
    name: 'cloud',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setCloudConnectionState, (state, action) => {
            state.isConnected = action.payload
        })

        builder.addCase(setCloudSyncState, (state, action) => {
            state.isSyncing = action.payload
        })

        builder.addCase(setCloudLoaded, (state, action) => {
            state.isLoaded = action.payload
        })
    },
})

export const cloudReducer = cloudSlice.reducer
