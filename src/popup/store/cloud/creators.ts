import { createAction } from '@reduxjs/toolkit'
import { CloudActionTypes } from './types'

export const setCloudLoading = createAction(CloudActionTypes.SET_LOADING, (val: boolean) => ({
    payload: val,
}))
