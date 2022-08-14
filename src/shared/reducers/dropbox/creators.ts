import { createAction } from '@reduxjs/toolkit'
import { DropboxActionTypes } from './types'

export const clearDropboxState = createAction(DropboxActionTypes.DROPBOX_CLEAR_STATE, () => {
    return {
        payload: {},
    }
})

export const setDropboxAuthId = createAction(
    DropboxActionTypes.DROPBOX_SET_AUTH_ID,
    (authId: string) => ({
        payload: authId,
    })
)

export const setDropboxAuthToken = createAction(
    DropboxActionTypes.DROPBOX_SET_AUTH_TOKEN,
    (token: string) => ({
        payload: token,
    })
)
