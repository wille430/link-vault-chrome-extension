import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { Popup } from './Popup'
;(async () => {
    while (true) {
        await new Promise<void>((resolve) => {
            setInterval(() => {
                window.context.saveAllChanges()
                resolve()
            }, 5000)
        })
    }
})()

const root = createRoot(document.getElementById('root') as Element)
root.render(
    <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/']}>
            <Popup />
        </MemoryRouter>
    </QueryClientProvider>
)
