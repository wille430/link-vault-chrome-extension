export interface DropboxState {
    authenticationId?: string
    authToken?: string
}

export enum DropboxActionTypes {
    DROPBOX_CLEAR_STATE = 'DROPBOX_CLEAR_STATE',
    DROPBOX_SET_AUTH_ID = 'DROPBOX_SET_AUTH_ID',
    DROPBOX_SET_AUTH_TOKEN = 'DROPBOX_SET_AUTH_TOKEN',
}
