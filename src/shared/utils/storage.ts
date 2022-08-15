import _ from 'lodash'

export type NestedKeyPath = string

export const getStorage = async (items: string | string[]) => {
    return await new Promise<{ [key: string]: any }>((resolve) => {
        chrome.storage.local.get(items, (data) => {
            resolve(data)
        })
    })
}

export const setStorage = async (path: NestedKeyPath, value: any) => {
    const [main, ...subkeys] = path.split('.')
    const data = await getStorage(main).then((x) => x[main] ?? {})

    _.set(data, subkeys.join('.'), value)

    await chrome.storage.local.set({
        [main]: data,
    })
}
