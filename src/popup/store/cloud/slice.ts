import { createSlice } from '@reduxjs/toolkit'
import { setCloudLoading } from './creators'
import { CloudState } from './types'

const initialState: CloudState = {
    isLoading: true,
}

export const cloudSlice = createSlice({
    name: 'cloud',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setCloudLoading, (state, action) => {
            state.isLoading = action.payload
        })
    },
})

export const cloudReducer = cloudSlice.reducer
