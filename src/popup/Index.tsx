import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { Popup } from './Popup'
import { store } from './store'

if (!window.store) {
    window.store = store
}

const root = createRoot(document.getElementById('root') as Element)
root.render(
    <Provider store={window.store}>
        <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter initialEntries={['/']}>
                <Popup />
            </MemoryRouter>
        </QueryClientProvider>
    </Provider>
)
