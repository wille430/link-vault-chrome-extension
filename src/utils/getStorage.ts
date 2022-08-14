export const getStorage = async (items: string | string[]) => {
    return await new Promise<{ [key: string]: any }>((resolve) => {
        chrome.storage.local.get(items, (data) => {
            resolve(data)
        })
    })
}
