import _ from 'lodash'

export type NestedKeyPath = string

export const getNestedObj = <T extends Record<any, any>>(obj: T, path: NestedKeyPath): any => {
    let ret = { ...obj }
    for (const subpath of path.split('/')) {
        ret = ret[subpath]
        if (ret == undefined) {
            return undefined
        }
    }
    return ret
}

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
