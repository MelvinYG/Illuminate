import "./App.css";
import HomePage from "./components/homePage/homePage";
import DevicesPage from "./components/devicesPage/devicesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, RequiredAuth } from "./routes/layout/layout";
import Login from "./routes/login/login";
import Signup from "./routes/signup/signup";

const App = () => {
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
          path: "/device",
          element: <Layout><DevicesPage /></Layout> // Devices page is protected and wrapped with layout
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App;
