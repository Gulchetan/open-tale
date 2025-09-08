import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // ✅ Import Tailwind CSS
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Usage from './pages/Usage.jsx'
import Explore from './pages/Explore.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'usage', element: <Usage /> },
      { path: 'explore', element: <Explore /> },
      { path: '*', element: <Home /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
