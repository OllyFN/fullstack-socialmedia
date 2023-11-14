import './global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store.ts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import Error from './pages/Error.tsx'
import Notifications from './pages/Notifications.tsx'
import Settings from './pages/Settings.tsx'
import SidebarNavigation from './components/SidebarNavigation.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'

export const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="page-nav-wrapper">
      <SidebarNavigation />
      <div className="page-wrapper">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Header />
      <Router />
    </Provider>
  </React.StrictMode>
)
