import { createSlice } from '@reduxjs/toolkit'
import { clearDropboxState, setDropboxAuthId, setDropboxAuthToken } from './creators'
import { DropboxState } from './types'

const initialState: DropboxState = {}

export const dropboxSlice = createSlice({
    name: 'dropbox',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(clearDropboxState, (state) => {
            state = {
                ...initialState,
            }
        })

        builder.addCase(setDropboxAuthId, (state, action) => {
            state.authenticationId = action.payload
        })

        builder.addCase(setDropboxAuthToken, (state, action) => {
            state.authToken = action.payload
        })
    },
})

export const dropboxReducer = dropboxSlice.reducer
