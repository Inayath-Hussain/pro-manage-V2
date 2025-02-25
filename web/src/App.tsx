import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import AnalyticsPage from './pages/Home/Analytics';
import HomePage from './pages/Home/Index';
import SettingsPage from './pages/Home/Settings';
import UserPage from './pages/User/Index';
import LoginPage from './pages/User/Login';
import RegisterPage from './pages/User/Register';
import BoardPage from './pages/Home/Board';
import PublicTaskPage from './pages/Public/Index';
import { routes } from './routes';

import "react-toastify/ReactToastify.css"
import RouteProtection from './components/RouteProtection';

function App() {

  return (
    <>
      <Routes>

        <Route path={routes.user.index} element={<UserPage />}>
          <Route path={routes.user.login} element={<LoginPage />} />
          <Route path={routes.user.register} element={<RegisterPage />} />
        </Route>

        <Route path={routes.home} element={<RouteProtection> <HomePage /> </RouteProtection>}>
          <Route index element={<RouteProtection> <BoardPage /> </RouteProtection>} />
          <Route path={routes.analytics} element={<RouteProtection> <AnalyticsPage /> </RouteProtection>} />
          <Route path={routes.settings} element={<RouteProtection> <SettingsPage /> </RouteProtection>} />
        </Route>


        <Route path={routes.public + ":id"} element={<PublicTaskPage />} />

        {/* add "not found" page here */}

      </Routes >

      <ToastContainer />
    </>
  )
}

export default App
