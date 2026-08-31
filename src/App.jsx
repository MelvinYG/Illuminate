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
import NotificationDetailPage from "./routes/notificationsPage/notificationDetailPage";
import RouteTelemetry from "./components/routeTelemetry/routeTelemetry";

const router = createBrowserRouter([
  {
    element: <RouteTelemetry />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/",
        element: <RequiredAuth />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: "/home", element: <Layout><HomePage /></Layout> },
          {
            path: "/devices",
            element: <Layout><DevicesPage /></Layout>,
            loader: devicePageLoader,
          },
          {
            path: "/profile",
            element: <Layout><ProfilePage /></Layout>,
            loader: profilePageLoader,
          },
          { path: "/analytics", element: <Layout><AnalyticsPage /></Layout> },
          { path: "/settings", element: <Layout><SettingsPage /></Layout> },
          { path: "/notifications", element: <Layout><NotificationsPage /></Layout> },
          {
            path: "/notifications/:notificationId",
            element: <Layout><NotificationDetailPage /></Layout>,
          },
        ],
      },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
]);

const App = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Handler to stop displaying the loader
  const handleLoaderComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <>
      {!loadingComplete && <Loader onComplete={handleLoaderComplete} />}
      {loadingComplete && <RouterProvider router={router}></RouterProvider>}
    </>
  )
}

export default App;
