import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TicketType,
  BookingStageType,
  OrderContentType,
  BookingData,
  TimeDataType,
  PassengerTicketType,
  SeatDataType,
  StationDataType,
  SeatsData
} from "./type/OrderType";


const initialOrderState: {
  ticket: TicketType;
  bookingStage: BookingStageType;
  bookingData: BookingData;
  orderContent: OrderContentType;
  searchProduct: string;
} = {
  ticket: "oneWayTicket",
  bookingStage: "selectStation",
  bookingData: {
    stationData: { endStation: "", startDate: "", startStation: "" },
    timeData: {
      startTime: {
        id: "",
        startStation: "",
        endStation: "",
        seats: "",
        Vehicles: "",
      },
      endTime: {
        id: "",
        startStation: "",
        endStation: "",
        seats: "",
        Vehicles: "",
      },
    },
    passengerTicket: {
      adult: { total: 0, type: "adult" },
      child: { total: 0, type: "child" },
      old: { total: 0, type: "old" },
    },
    seatsData: { oneWayTicket: [], roundTripTicket: [] },
  },
  orderContent: {
    paymentState: "pendingPayment",
    title: "reserve",
    remarks: "",
    industryName: "",
    routeName:'',
    totalAmount: 0,
    paymentMethod: "",
  },
  searchProduct: "" ,
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
    resetBookingData(state) {
      state.bookingData = initialOrderState.bookingData;
      state.bookingStage = "selectStation";
    },
    // 重設orderContent
    resetOrderContent(state) {
      state.orderContent = initialOrderState.orderContent;
    },
    // 訂單狀態頁面狀態切換
    orderContentStateChenge(state, action: PayloadAction<OrderContentType>) {
      state.orderContent = {
        ...state.orderContent,
        ...action.payload,
      };
    },
    // 儲存搜尋路線
     setSearchProduct(state, action:PayloadAction<string>) {
      state.searchProduct = action.payload
     },
    // 儲存搭車車站、日期
    setStationData(state, action: PayloadAction<StationDataType>) {
      state.bookingData.stationData = action.payload;
    },
    // 儲存搭車時間
    setTimeData(state, action: PayloadAction<[keyof BookingData['timeData'], TimeDataType]>) {
      const [keyToUpdate, newData] = action.payload;
      state.bookingData.timeData[keyToUpdate] = newData;
    },
    // 儲存乘客數票數
    setPassengerTicket(state, action: PayloadAction<PassengerTicketType>) {
      const { type, total } = action.payload;
      state.bookingData.passengerTicket[type] = { type, total };
    },
    // 儲存劃位資料
    setSeatsData(state, action: PayloadAction<[SeatDataType[], keyof SeatsData]>) {
      const [newData, ticketType] = action.payload;
      state.bookingData.seatsData[ticketType] = newData;
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
