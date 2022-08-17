export interface CloudState {
    isConnected: boolean
    isSyncing: boolean
    isLoaded: boolean
}

export enum CloudActionTypes {
    SET_CONNECTION_STATE = 'SET_CONNECTION_STATE',
    SET_LOADED = 'SET_LOADED',
    SET_SYNC_STATE = 'SET_SYNC_STATE',
}
