import { API_URL } from '../constants'

export const customFetcher = async <T = any>(
    url: string,
    options: Parameters<typeof fetch>[1] & { _retry?: boolean } = {}
): Promise<T> => {
    if (!options) options = {}

    options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    }

    return fetch(new URL(url, API_URL), options).then(async (res) => res.json())
}
