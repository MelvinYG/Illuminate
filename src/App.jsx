import "./App.css";
import HomePage from "./components/homePage/homePage";
import DevicesPage from "./components/devicesPage/devicesPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Layout, RequiredAuth } from "./routes/layout/layout";
import Login from "./routes/login/login";
import Signup from "./routes/signup/signup";
import ProfilePage from "./routes/profilePage/profilePage";
import { devicePageLoader, profilePageLoader } from "./lib/loaders";
import AnalyticsPage from "./routes/analyticsPage/analyticsPage";
import SettingsPage from "./routes/settingsPage/settingsPage";
import Loader from "./components/loaderComponent/loaderCompo";
import { useState } from "react";
import NotificationsPage from "./routes/notificationsPage/notificationsPage";

const App = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Handler to stop displaying the loader
  const handleLoaderComplete = () => {
    setLoadingComplete(true);
  };

  const router = createBrowserRouter([
    // Unprotected routes (Login and Signup)
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "*", // Catch-all for undefined routes
      element: <Login />
    },
    // Protected routes (after login)
    {
      path: "/",
      element: <RequiredAuth />, // Protect routes with authentication
      children: [
        {
          path: "/home",
          element: <Layout><HomePage /></Layout> // Apply layout only after login
        },
        {
          path: "/devices",
          element: <Layout><DevicesPage /></Layout> ,// Devices page is protected and wrapped with layout
          loader: devicePageLoader
        },
        {
          path: "/profile",
          element: <Layout><ProfilePage /> </Layout>,
          loader: profilePageLoader
        },
        {
          path: "/analytics",
          element: <Layout><AnalyticsPage /></Layout>
        },
        {
          path: "/settings",
          element: <Layout><SettingsPage /></Layout>
        },
        {
          path: "/notifications",
          element: <Layout><NotificationsPage /></Layout>
        },
        // Redirect root to home after login
        {
          path: "/",
          element: <Navigate to="/home" />
        }
      ]
    }
  ]);

  return (
    <>
      {!loadingComplete && <Loader onComplete={handleLoaderComplete} />}
      {loadingComplete && <RouterProvider router={router}></RouterProvider>}
    </>
  )
}

export default App;
