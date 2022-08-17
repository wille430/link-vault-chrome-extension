import { createAction } from '@reduxjs/toolkit'
import { CloudActionTypes } from './types'

export const setCloudConnectionState = createAction(
    CloudActionTypes.SET_CONNECTION_STATE,
    (val: boolean) => ({
        payload: val,
    })
)

export const setCloudSyncState = createAction(CloudActionTypes.SET_SYNC_STATE, (val: boolean) => ({
    payload: val,
}))

export const setCloudLoaded = createAction(CloudActionTypes.SET_LOADED, (val: boolean) => ({
    payload: val,
}))
