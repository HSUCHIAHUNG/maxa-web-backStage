import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

const DefaultLayoutPage = lazy(() => import("../layout/DefaultLayout"));
const ErrorPage = lazy(() => import("../pages/Error"));
const OrderPage = lazy(() => import("../pages/Order/Order"));
const ProductDetailPage = lazy(() => import("../pages/Order/ProductDetail"));

const routes = [
  {
    path: "/",
    element: <DefaultLayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      // 櫃台訂票
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <OrderPage />
          </Suspense>
        ),
      },
      // 櫃台訂票產品細節
      {
        path: ":productDetail",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
