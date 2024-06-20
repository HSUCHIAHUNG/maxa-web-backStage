import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading"; // 引入Loading組件

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DefaultLayoutPage = lazy(() =>
  delay(500).then(() => import("../layout/DefaultLayout"))
);
const ErrorPage = lazy(() => delay(500).then(() => import("../pages/Error")));
const OrderPage = lazy(() =>
  delay(500).then(() => import("../pages/Reserve/Reserve"))
);
const ProductDetailPage = lazy(() =>
  delay(500).then(() => import("../pages/Reserve/ProductDetail"))
);
const OrderContentPage = lazy(() =>
  delay(500).then(() => import("../pages/OrderContent"))
);
const OrderHistoryPage = lazy(() =>
  delay(500).then(() => import("../pages/OrderHistory/OrderHistory"))
);
const LoginPage = lazy(() => delay(500).then(() => import("../pages/Login")));
const MemberListPage = lazy(() =>
  delay(500).then(() => import("../pages/MemberList/MemberList"))
);
const RoutesChartssPage = lazy(() =>
  delay(500).then(() => import("../pages/Chart/RoutesCharts"))
);
const IndustryChartsPage = lazy(() =>
  delay(500).then(() => import("../pages/Chart/IndustryCharts"))
);
const CheckoutDetailsPage = lazy(() =>
  delay(500).then(() => import("../pages/Report/CheckoutDetails"))
);
const CheckoutReportPage = lazy(() =>
  delay(500).then(() => import("../pages/Report/CheckoutReport"))
);
const PrivateRouterPage = lazy(() => import("../pages/PrivateRouter"));

const routes = [
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading isLoading={true} />}>
        <PrivateRouterPage />
      </Suspense>
    ),
    children: [
      {
        path: "login",
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
    ],
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
