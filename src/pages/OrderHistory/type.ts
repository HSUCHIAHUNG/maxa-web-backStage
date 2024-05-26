import { paymentStateType } from "../../stores/type/OrderType";

// table資料內容型別
export type OrderRecord = {
  key: string;
  orderNumber: string;
  customer: string;
  provider: string;
  routeProduct: string;
  orderAmount: string;
  orderTime: string;
  orderStatus: paymentStateType;
};