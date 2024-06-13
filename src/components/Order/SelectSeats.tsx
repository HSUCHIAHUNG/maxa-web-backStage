import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { orderActions } from "../../stores/order";
import { RootState, useAppDispatch } from "../../stores/index";
import {
  Button,
  Form,
  InputNumber,
  // Radio,
  Message,
  // Input,
} from "@arco-design/web-react";
import SetSeat from "./SetSeat";
// 匯入型別
import { PassengerTicketKey } from "../../stores/type/OrderType";

// 付款方式選項
// const paymentOptions = [
//   { value: "現金付款", label: "現金付款" },
//   { value: "信用卡付款", label: "信用卡付款" },
//   { value: "電子支付", label: "電子支付" },
// ];

interface FormValues {
  adult: number;
  child: number;
  old: number;
  payment: string;
  remarks?: string;
}

const SelectSeats: React.FC = () => {
  const FormItem = Form.Item;
  // const TextArea = Input.TextArea;
  const [form] = Form.useForm<FormValues>();
  // const RadioGroup = Radio.Group;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(orderActions.resetBookingData());
  }, [dispatch]);

  const [isSetSeats, setIsSetSeats] = useState({
    isOpen: false,
    ticketState: "",
  });

  const [selectedOneWayMethod, setSelectedOneWayMethod] =
    useState("系統自動劃位");
  const [selectedRoundTripMethod, setSelectedRoundTripMethod] =
    useState("系統自動劃位");

  const tabState = useSelector((state: RootState) => state.order.ticket);
  const bookingStage = useSelector(
    (state: RootState) => state.order.bookingStage
  );
  const passengerTicket = useSelector(
    (state: RootState) => state.order.bookingData.passengerTicket
  );
  const seatsData = useSelector(
    (state: RootState) => state.order.bookingData?.seatsData
  );

  const passengerTicketTotal = Object.values(passengerTicket).reduce(
    (acc, obj) => acc + obj.total,
    0
  );

  const totalAmount = () => {
    if (Object.keys(passengerTicket).length > 0) {
      return (
        passengerTicket.adult.total * 100 +
        passengerTicket.child.total * 80 +
        passengerTicket.old.total * 80
      );
    }
    return 100;
  };

  const submit = (value: FormValues) => {
    const remarks = value.remarks ? String(value.remarks) : "";
    if (passengerTicketTotal < 1) {
      Message.error("乘客票數不可小於1");
      return;
    }

    if (tabState === "oneWayTicket" && selectedOneWayMethod === "手動劃位") {
      if (seatsData.oneWayTicket.length !== passengerTicketTotal) {
        Message.error("票數與已選座位數不符");
        return;
      }
    }

    if (
      tabState === "roundTripTicket" &&
      (selectedOneWayMethod === "手動劃位" ||
        selectedRoundTripMethod === "手動劃位")
    ) {
      if (
        seatsData.oneWayTicket.length + seatsData.roundTripTicket.length !==
        passengerTicketTotal * 2
      ) {
        Message.error("票數與已選座位數不符");
        return;
      }
    }

    dispatch(
      orderActions.orderContentStateChenge({
        title: "reserve",
        paymentState: "pendingPayment",
        remarks: remarks,
        totalAmount: totalAmount(),
      })
    );
    navigate(`/orderContent/${id}`);
  };

  const seatHandler = (
    selectSeatsMethod: string,
    selectSeatsState: string,
    type: string
  ) => {
    if (type === "oneWay") {
      setSelectedOneWayMethod(selectSeatsMethod);
    } else {
      setSelectedRoundTripMethod(selectSeatsMethod);
    }

    if (selectSeatsMethod === "手動劃位") {
      if (passengerTicketTotal < 1) {
        Message.error("乘客票數不可小於1");
        return;
      }
      setIsSetSeats((prevState) => ({
        ...prevState,
        isOpen: !prevState.isOpen,
        ticketState: selectSeatsState,
      }));
    }
  };

  const storePassengerTicket = (total: number, type: PassengerTicketKey) => {
    const ticket = {
      type: type,
      total: total,
    };
    dispatch(orderActions.setPassengerTicket(ticket));
  };

  return (
    <div className={`${bookingStage !== "selectSeats" ? "hidden" : "block"}`}>
      <Form
        form={form}
        autoComplete="on"
        requiredSymbol={{ position: "start" }}
        layout="vertical"
        initialValues={{
          adult: 0,
          child: 0,
          old: 0,
          payment: "現金付款",
        }}
        onSubmit={submit}
      >
        <FormItem
          label="成人票數"
          field="adult"
          required
          className={`m-0 md:w-[180px]`}
        >
          <InputNumber
            onChange={(value) => storePassengerTicket(value, "adult")}
            mode="button"
            defaultValue={0}
            min={0}
            max={10}
            className={`!w-full md:w-[200px]`}
            style={{ width: 160, margin: "10px 24px 10px 0" }}
          />
        </FormItem>
        <FormItem
          label="兒童票數"
          field="child"
          required
          tooltip={
            <div>
              兒童身高滿115公分而未滿150公分，或身高滿150公分而未滿12歲者，經出示身分證件者
            </div>
          }
          className={`m-0 md:w-[180px]`}
        >
          <InputNumber
            onChange={(value) => storePassengerTicket(value, "child")}
            mode="button"
            defaultValue={0}
            min={0}
            max={10}
            className={`!w-full md:w-[200px]`}
            style={{ width: 160, margin: "10px 24px 10px 0" }}
          />
        </FormItem>
        <FormItem
          label="敬老票數"
          field="old"
          required
          tooltip={<div>年滿65歲以上，持有國民身分證或敬老證之老人</div>}
          className={`m-0 md:w-[180px] mb-[16px]`}
        >
          <InputNumber
            onChange={(value) => storePassengerTicket(value, "old")}
            mode="button"
            defaultValue={0}
            min={0}
            max={20}
            className={`!w-full md:w-[200px]`}
            style={{ width: 160, margin: "10px 24px 10px 0" }}
          />
        </FormItem>

        <FormItem label="選擇去程座位" required>
          <div className={`flex justify-between`}>
            <button
              onClick={() =>
                seatHandler("系統自動劃位", "選擇去程座位", "oneWay")
              }
              type="button"
              className={`w-[48%] h-[60px] rounded-[8px] px-[16px] py-[8px] border border-solid  ${
                selectedOneWayMethod === "系統自動劃位"
                  ? "text-[#3A57E8] border-[#3A57E8] bg-[#E8F0FF]"
                  : "border-[#E5E6EB]"
              }`}
            >
              <p className={`text-left`}>系統自動劃位</p>
            </button>
            <button
              onClick={() => seatHandler("手動劃位", "選擇去程座位", "oneWay")}
              type="button"
              className={`w-[48%] h-[60px] rounded-[8px] px-[16px] py-[8px] border border-solid ${
                selectedOneWayMethod === "手動劃位"
                  ? "text-[#3A57E8] border-[#3A57E8] bg-[#E8F0FF]"
                  : "border-[#E5E6EB]"
              }`}
            >
              <div className={`flex justify-between items-center`}>
                <div>
                  <p className={`text-left`}>手動劃位</p>
                  <p className={`text-[#4E5969]`}>點選以選取座位</p>
                </div>
                <span className="icon-[solar--arrow-right-line-duotone] w-[32px] h-[32px] text-[#4E5969] "></span>
              </div>
            </button>
          </div>
        </FormItem>

        {tabState === "roundTripTicket" && (
          <FormItem label="選擇回程座位" required>
            <div className={`flex justify-between`}>
              <button
                onClick={() =>
                  seatHandler("系統自動劃位", "選擇回程座位", "roundTrip")
                }
                type="button"
                className={`w-[48%] h-[60px] rounded-[8px] px-[16px] py-[8px] border border-solid ${
                  selectedRoundTripMethod === "系統自動劃位"
                    ? "text-[#3A57E8] border-[#3A57E8] bg-[#E8F0FF]"
                    : "border-[#E5E6EB]"
                }`}
              >
                <p className={`text-left`}>系統自動劃位</p>
              </button>
              <button
                onClick={() =>
                  seatHandler("手動劃位", "選擇回程座位", "roundTrip")
                }
                type="button"
                className={`w-[48%] h-[60px] rounded-[8px] px-[16px] py-[8px] border border-solid ${
                  selectedRoundTripMethod === "手動劃位"
                    ? "text-[#3A57E8] border-[#3A57E8] bg-[#E8F0FF]"
                    : "border-[#E5E6EB]"
                }`}
              >
                <div className={`flex justify-between items-center`}>
                  <div>
                    <p className={`text-left`}>手動劃位</p>
                    <p className={`text-[#4E5969]`}>點選以選取座位</p>
                  </div>
                  <span className="icon-[solar--arrow-right-line-duotone] w-[32px] h-[32px] text-[#4E5969] "></span>
                </div>
              </button>
            </div>
          </FormItem>
        )}

        {/* <FormItem label="乘客付款方式備註" field="payment" required>
          <RadioGroup
            options={paymentOptions}
            className={`flex gap-[10px]`}
          ></RadioGroup>
        </FormItem> */}

        {/* <div className={`flex flex-col gap-[12px]`}>
          <p className={`text-[#4E5969]`}>備註</p>
          <FormItem field="remarks">
            <TextArea placeholder="Please enter ..." />
          </FormItem>
        </div> */}

        <div className={`flex justify-between w-full pt-[16px]`}>
          <div className={`text-[12px] md:text-[13px] text-[#86909C]`}>
            <p>商品最小購買數量：{passengerTicketTotal}</p>
            <p>商品最大購買數量：10</p>
          </div>
          <div>
            <div className={`relative text-[#86909C]`}>
              <div
                className={` absolute w-[60px] border-b botder-solid botder-[#86909C] right-[-10px] top-[9px] md:top-[10px] md:w-[70px]`}
              ></div>
              <p className={`text-[12px] md:text-[14px] text-right`}>NT$ 140</p>
            </div>
            <p className={`text-[16px] md:text-[20px]`}>NT$ {totalAmount()}</p>
          </div>
        </div>

        <div className={`flex flex-col gap-[8px] pt-[8px] md:flex-row`}>
          <FormItem className={`m-0 md:w-[180px]`}>
            <Button
              onClick={() => dispatch(orderActions.switchStage("selectTime"))}
              className={`w-[100%] !text-[#4E5969] !bg-[#F2F3F5] !m-0`}
              type="primary"
              htmlType="button"
            >
              上一步，重新選擇班次
            </Button>
          </FormItem>
          <FormItem className={`m-0`}>
            <Button
              className={`w-[100%] !bg-[#3A57E8] !m-0`}
              type="primary"
              htmlType="submit"
            >
              確認購買
            </Button>
          </FormItem>
        </div>
      </Form>

      {/* --------劃位彈窗-------- */}
      {/* 去程 */}
      <div
        className={`${
          isSetSeats.isOpen && isSetSeats.ticketState === "選擇去程座位"
            ? "block"
            : "hidden"
        }`}
      >
        <SetSeat
          isSetSeats={isSetSeats.isOpen}
          setIsSetSeats={setIsSetSeats}
          ticketState={isSetSeats.ticketState}
        ></SetSeat>
      </div>

      {/* 回程 */}
      <div
        className={`${
          isSetSeats.isOpen && isSetSeats.ticketState === "選擇回程座位"
            ? "block"
            : "hidden"
        }`}
      >
        <SetSeat
          isSetSeats={isSetSeats.isOpen}
          setIsSetSeats={setIsSetSeats}
          ticketState={isSetSeats.ticketState}
        ></SetSeat>
      </div>
    </div>
  );
};

export default SelectSeats;
