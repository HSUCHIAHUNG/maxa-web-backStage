import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// selectTime階段
interface TimeDataType {
  id: string;
  startStation: string;
  endStation: string;
  seats: string;
  Vehicles: string;
}

// 票數、座位
interface PassengerTicketType {
  type: string;
  total: number;
}

// 儲存劃位資料
interface SeatDataType {
  id: number;
  type: string;
  name: string | null;
}

// 儲存劃位資料
interface SeatsData {
  [key: string]: SeatDataType[];
}

// 儲存定單資料型別
interface BookingData {
  stationData: { [key: string]: object };
  timeData: { [key: string]: TimeDataType }; // 將 timeData 介面應用於 timeData 物件
  seatsData: SeatsData;
  passengerTicket: { [key: string]: PassengerTicketType };
}

// 訂單票種(單程票、來回票)
type TicketType = "oneWayTicket" | "roundTripTicket";

// 訂購階段( 選擇站點、時間、座位 )
type BookingStageType =
  | "selectStation"
  | "selectTime"
  | "selectSeats"
  | "selectPayment"
  | "passengerData";

// 付款狀態
type OrderContentType = {
  paymentState: "pendingPayment" | "alreadyPaid" | "expired" | 'refund' | 'activeComplate' | '' ;
  title: "reserve" | "orderHistory" | "";
  remarks?: string;
  totalAmount?: number | string;
  paymentMethod?: string;
};

// 選擇產品
interface SelectedProductType {
  route: string;
}

const initialOrderState: {
  ticket: TicketType;
  bookingStage: BookingStageType;
  orderContent: OrderContentType;
  bookingData: BookingData;
  selectedProduct: SelectedProductType;
} = {
  ticket: "oneWayTicket",
  bookingStage: "selectStation",
  orderContent: {
    paymentState: "pendingPayment",
    title: "",
    remarks: "",
    totalAmount: 0,
    paymentMethod:''
  },
  selectedProduct: { route: "" },
  bookingData: {
    stationData: {},
    timeData: {},
    passengerTicket: {
      adult: { total: 0, type: "adult" },
      child: { total: 0, type: "child" },
      old: { total: 0, type: "old" },
    },
    seatsData: { oneWayTicket: [], roundTripTicket: [] },
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState: initialOrderState,
  reducers: {
    // 切換訂單票種(單程票、來回票)
    switchTab(state) {
      return {
        ...state,
        ticket:
          state.ticket === "oneWayTicket" ? "roundTripTicket" : "oneWayTicket",
        bookingStage: "selectStation",
      };
    },
    // 切換訂購階段
    switchStage(state, action: PayloadAction<BookingStageType>) {
      state.bookingStage = action.payload;
    },
    // 重設bookingData
    reseBbookingData(state) {
      state.bookingData = initialOrderState.bookingData;
      state.bookingStage = "selectStation";
    },
    // 訂單狀態頁面狀態切換
    orderContentStateChenge(state, action: PayloadAction<OrderContentType>) {
      state.orderContent = {
        ...state.orderContent,
        ...action.payload,
      };
    },
    // 儲存搭車車站、日期
    setStationData(state, action: PayloadAction<[string, object]>) {
      const [keyToUpdate, newData] = action.payload;
      state.bookingData.stationData[keyToUpdate] = newData;
    },
    // 儲存搭車時間
    setTimeData(state, action: PayloadAction<[string, TimeDataType]>) {
      const [keyToUpdate, newData] = action.payload;
      state.bookingData.timeData[keyToUpdate] = newData;
    },
    // 儲存乘客數票數
    setPassengerTicket(state, action: PayloadAction<PassengerTicketType>) {
      const { type, total } = action.payload;
      state.bookingData.passengerTicket[type] = { type, total };
    },
    // 儲存劃位資料
    setSeatsData(state, action: PayloadAction<[SeatDataType[], string]>) {
      const [newData, ticketType] = action.payload;
      state.bookingData.seatsData[ticketType] = newData;
    },
    // 儲存選擇產品
    selectProduct: (state, action: PayloadAction<SelectedProductType>) => {
      state.selectedProduct.route = action.payload.route;
      console.log(state.selectedProduct);
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
