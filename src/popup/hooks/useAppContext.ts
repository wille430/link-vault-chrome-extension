import { useEffect, useState } from 'react'
import { AppContext } from '../../background/AppContext'

export const useAppContext = () => {
    let [context, setContext] = useState<AppContext>(window.context)

    useEffect(() => {
        chrome.runtime.getBackgroundPage((page) => {
            if (page) {
                setContext(page.window.context)
            }
        })
    }, [window.context])

    return context
}
