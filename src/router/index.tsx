import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";

const DefaultLayoutPage = lazy(() => import("../layout/DefaultLayout"));
const ErrorPage = lazy(() => import("../pages/Error"));


const routes = [
  {
    path: "/",
    element: <DefaultLayoutPage />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
