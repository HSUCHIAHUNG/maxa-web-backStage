import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

const DefaultLayoutPage = lazy(() => import("../layout/DefaultLayout"));
const ErrorPage = lazy(() => import("../pages/Error"));
const OrderPage = lazy(() => import("../pages/Order/Order"));
const ProductDetailPage = lazy(() => import("../pages/Order/ProductDetail"));
const OrderContentPage = lazy(() => import("../pages/OrderContent"));
const OrderHistoryPage = lazy(
  () => import("../pages/OrderHistory/OrderHistory")
);
const LoginPage = lazy(() => import("../pages/Login"));
const MemberListPage = lazy(() => import("../pages/MemberList"));
const RoutesChartssPage = lazy(() => import("../pages/Chart/RoutesCharts"));
const IndustryChartsPage = lazy(() => import("../pages/Chart/IndustryCharts"));
const CheckoutDetailsPage = lazy(
  () => import("../pages/Report/CheckoutDetails")
);
const CheckoutReportPage = lazy(() => import("../pages/Report/CheckoutReport"));

const routes = [
  // 登入頁
  {
    path: "/login",
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultLayoutPage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      // 櫃台訂票產品細節
      {
        path: "order/:productDetail",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      // 票券詳細頁
      {
        path: "orderContent/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <OrderContentPage />
          </Suspense>
        ),
      },
      // 訂單紀錄
      {
        path: "orderHistory",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <OrderHistoryPage />
          </Suspense>
        ),
      },
      // 會員列表
      {
        path: "memberList",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MemberListPage />
          </Suspense>
        ),
      },
      // 櫃台訂票
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <OrderPage />
          </Suspense>
        ),
      },
      // 圖表-路線班次
      {
        path: "/routesCharts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RoutesChartssPage />
          </Suspense>
        ),
      },
      // 圖表-業者路線
      {
        path: "/industryCharts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <IndustryChartsPage />
          </Suspense>
        ),
      },
      // 營運報表-結帳明細
      {
        path: "/checkoutDetails",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CheckoutDetailsPage />
          </Suspense>
        ),
      },
      // 營運報表-結帳報表
      {
        path: "/checkoutReport",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CheckoutReportPage />
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
