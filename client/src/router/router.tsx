import { createBrowserRouter } from "react-router-dom";
import TextPage from "../pages/TextPage";
import Login from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/chat",
    element: <TextPage />
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>
  }
])
