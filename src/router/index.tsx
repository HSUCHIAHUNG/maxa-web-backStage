import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading"; // 引入Loading組件

const DefaultLayoutPage = lazy(() => import("../layout/DefaultLayout"));
const ErrorPage = lazy(() => import("../pages/Error"));
const OrderPage = lazy(() => import("../pages/Reserve/Reserve"));
const ProductDetailPage = lazy(() => import("../pages/Reserve/ProductDetail"));
const OrderContentPage = lazy(() => import("../pages/OrderContent"));
const OrderHistoryPage = lazy(
  () => import("../pages/OrderHistory/OrderHistory")
);
const LoginPage = lazy(() => import("../pages/Login"));
const MemberListPage = lazy(() => import("../pages/MemberList"));
const RoutesChartssPage = lazy(() =>import("../pages/Chart/RoutesCharts"));

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
      <Suspense fallback={<Loading isLoading={true} />}>
        <ErrorPage />
      </Suspense>
    ),
    element: (
      <Suspense fallback={<Loading isLoading={true} />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading isLoading={true} />}>
        <DefaultLayoutPage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<Loading isLoading={true} />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      // 櫃台訂票產品細節
      {
        path: "order/:id",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      // 票券詳細頁
      {
        path: "orderContent/:id",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <OrderContentPage />
          </Suspense>
        ),
      },
      // 訂單紀錄
      {
        path: "/orderHistory",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <OrderHistoryPage />
          </Suspense>
        ),
      },
      // 會員列表
      {
        path: "memberList",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <MemberListPage />
          </Suspense>
        ),
      },
      // 櫃台訂票
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <OrderPage />
          </Suspense>
        ),
      },
      // 圖表-路線班次
      {
        path: "/routesCharts",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <RoutesChartssPage />
          </Suspense>
        ),
      },
      // 圖表-業者路線
      {
        path: "/industryCharts",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <IndustryChartsPage />
          </Suspense>
        ),
      },
      // 營運報表-結帳明細
      {
        path: "/checkoutDetails",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
            <CheckoutDetailsPage />
          </Suspense>
        ),
      },
      // 營運報表-結帳報表
      {
        path: "/checkoutReport",
        element: (
          <Suspense fallback={<Loading isLoading={true} />}>
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
