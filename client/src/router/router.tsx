import { createBrowserRouter } from "react-router-dom";
import TextPage from "../pages/TextPage";

export const router = createBrowserRouter([
  {
    path: "/",
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
