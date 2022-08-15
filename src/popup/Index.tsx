import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { Popup } from './Popup'

const root = createRoot(document.getElementById('root') as Element)
root.render(
    <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/']}>
            <Popup />
        </MemoryRouter>
    </QueryClientProvider>
)
