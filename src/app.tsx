import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateTripPage } from './pages/create-trip'
import { TripDetailsPage } from './pages/trip-details'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateTripPage />,
  },
  {
    path: '/trips/:tripId',
    element: <TripDetailsPage />,
  },
])

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
