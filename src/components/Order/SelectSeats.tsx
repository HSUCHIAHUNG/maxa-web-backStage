// react原生方法
import React, { useState } from "react";
// redux
import { useSelector } from "react-redux";
import { orderActions } from "../../stores/order";
import { RootState, useAppDispatch } from "../../stores/index";
// ui kit
import {
  Button,
  Form,
  InputNumber,
  Radio,
  Space,
  Typography,
  Message,
  Input,
} from "@arco-design/web-react";
import SetSeat from "./SetSeat";

// 支付方式選項內容
const options = [
  { value: "現金付款", label: "現金付款" },
  { value: "信用卡付款", label: "信用卡付款" },
  { value: "電子支付", label: "電子支付" },
];

const SelectSeats: React.FC = () => {
  // ui kit
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const [form] = Form.useForm();
  const RadioGroup = Radio.Group;

  // redux(方法調用)
  const dispatch = useAppDispatch();

  // 手動劃位
  const [isSetSeats, setIsSetSeats] = useState({
    isOpen: false,
    ticketState: "",
  });

  // 自動劃位
  const [autoSeats, setAutoSeats] = useState(true);

  // ticket( 單程票、來回票 )狀態
  const tabState = useSelector((state: RootState) => state.order.ticket);

  // 訂車階段(起訖站、日期、時間狀態)
  const bookingStage = useSelector(
    (state: RootState) => state.order.bookingStage
  );

  // 乘客票數
  const passengerTicket = useSelector(
    (state: RootState) => state.order.bookingData.passengerTicket
  );

  // 去程已選座位數
  const oneWayTicketSeats = useSelector(
    (state: RootState) => state.order.bookingData?.seatsData?.oneWayTicket
  );

  // 回程已選座位數
  const roundTripTicket = useSelector(
    (state: RootState) => state.order.bookingData?.seatsData?.roundTripTicket
  );

  // 已選乘客總數
  const passengerTicketTotal = Object.values(passengerTicket).reduce(
    (acc, obj) => acc + obj.total,
    0
  );

  // 計算總金額
  const totalAmount = () => {
    if (Object.keys(passengerTicket).length > 0) {
      console.log(passengerTicket);
      return (
        passengerTicket.adult.total * 100 +
        passengerTicket.child.total * 80 +
        passengerTicket.old.total * 80
      );
    }
    return 100;
  };

  //  login表單提交
  const submit = (value) => {
    console.log(value);

    // 獲取 TextArea 的值
    const remarks = form.getFieldValue("remarks") || "";

    // 判斷乘客是否已選票
    if (passengerTicketTotal < 1) {
      Message.error("乘客票數不可小於1");
      return;
    } else {
      // 單程票
      if (tabState === "oneWayTicket" && !autoSeats) {
        if (oneWayTicketSeats.length !== passengerTicketTotal) {
          Message.error("票數與已選座位數不符");
          return;
        }
      }

      // 來回票
      if (tabState === "roundTripTicket" && !autoSeats) {
        if (
          oneWayTicketSeats.length + roundTripTicket.length !==
          passengerTicketTotal * 2
        ) {
          Message.error("票數與已選座位數不符");
          return;
        }
      }
    }

    // 將票價跟備註存進redux
    dispatch(
      orderActions.orderContentStateChenge({
        title: "reserve",
        paymentState: "alreadyPaid",
        remarks: remarks,
        totalAmount: totalAmount(),
      })
    );

    // redux(切換tab全域狀態)
    dispatch(orderActions.switchStage("selectPayment"));
  };

  // 控制訂車階段顯示
  const isOpen = () => (bookingStage !== "selectSeats" ? "hidden" : "block");

  // 設定座位
  const seatHandler = (
    _checked: boolean,
    event: React.ChangeEvent<Element>,
    state: string
  ) => {
    if ((event.target as HTMLInputElement).defaultValue === "手動劃位") {
      setAutoSeats(false);
      if (passengerTicketTotal < 1) {
        Message.error("乘客票數不可小於1");
        return;
      }
      setIsSetSeats((prevState) => ({
        ...prevState,
        isOpen: !prevState.isOpen,
        ticketState: state, // 这里使用参数 state 而不是 state 函数
      }));
    }

    if ((event.target as HTMLInputElement).defaultValue === "自動劃位") {
      setAutoSeats(true);
    }
  };

  // 儲存票數票種( 成人、兒童、敬老 )
  function storePassengerTicket(total: number, type: string) {
    const ticket = {
      type: type,
      total: total,
    };
    dispatch(orderActions.setPassengerTicket(ticket));
  }

  return (
    <>
      {isOpen() === "block" && (
        <>
          {/* 劃位階段內容 */}
          <Form
            form={form}
            autoComplete="on"
            requiredSymbol={{ position: "start" }}
            layout="vertical"
            initialValues={{
              aldult: 0,
              child: 0,
              old: 0,
            }}
            onSubmit={submit}
          >
            {/* 票數瞟種選擇( 成人、兒童、敬老票 ) */}
            <FormItem
              label="成人票數"
              field="aldult"
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

            {/* 選擇去程座位 */}
            <FormItem label="選擇去程座位" required>
              <div className={`flex justify-between`}>
                {/* 系統自動劃位 */}
                <div className="w-[48%] h-[60px] rounded-[8px] px-[16px] border border-solid border-[#E5E6EB]">
                  123
                </div>

                {/* 手動劃位 */}
                <div
                  className={`w-[48%] h-[60px] rounded-[8px] px-[16px] border border-solid border-[#E5E6EB]`}
                >
                  123
                </div>
              </div>
            </FormItem>

            {/* 選擇回程座位 */}
            {tabState === "roundTripTicket" && (
              <FormItem label="選擇回程座位" required>
                <Radio.Group
                  name="card-radio-group"
                  defaultValue="系統自動劃位"
                  className={`flex flex-col gap-[8px] md:flex-row`}
                >
                  {["系統自動劃位", "手動劃位"].map((item) => {
                    return (
                      <Radio
                        onChange={(_checked, event) =>
                          seatHandler(_checked, event, "選擇回程座位")
                        }
                        key={item}
                        value={item}
                        className={`w-full !m-0 p-0`}
                      >
                        {({ checked }) => {
                          return (
                            <Space
                              align="start"
                              className={` flex items-center justify-between custom-radio-card ${
                                checked ? "custom-radio-card-checked" : ""
                              }`}
                            >
                              <div className={`flex items-center gap-[8px]`}>
                                <div className="custom-radio-card-mask">
                                  <div className="custom-radio-card-mask-dot"></div>
                                </div>
                                {item === "系統自動劃位" && (
                                  <div className="custom-radio-card-title h-[44px] leading-[48px] ">
                                    系統自動劃位
                                  </div>
                                )}
                                {item === "手動劃位" && (
                                  <div
                                    className={`flex items-center justify-between`}
                                  >
                                    <div>
                                      <div className="custom-radio-card-title">
                                        手動劃位
                                      </div>
                                      <Typography.Text
                                        type="secondary"
                                        className={`flex items-center  `}
                                      >
                                        <p>點選以選取座位</p>
                                      </Typography.Text>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {item === "手動劃位" && (
                                <span className="icon-[solar--arrow-right-line-duotone] w-[32px] h-[32px] text-[#4E5969] "></span>
                              )}
                            </Space>
                          );
                        }}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </FormItem>
            )}

            {/* 乘客付款方式備註 */}
            <FormItem label="乘客付款方式備註" field="payment" required>
              <RadioGroup
                options={options}
                className={`flex gap-[10px]`}
              ></RadioGroup>
            </FormItem>

            {/* 備註 */}
            <div className={`flex flex-col gap-[12px]`}>
              <p className={`text-[#4E5969]`}>備註</p>
              <FormItem field="remarks">
                <TextArea placeholder="Please enter ..." />
              </FormItem>
            </div>

            {/* 商品數量顯示 */}
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
                  <p className={`text-[12px] md:text-[14px] text-right`}>
                    NT$ 140
                  </p>
                </div>
                <p className={`text-[16px] md:text-[20px]`}>
                  NT$ {totalAmount()}
                </p>
              </div>
            </div>

            {/* 階段切換按鈕 */}
            <div className={`flex flex-col gap-[8px] pt-[8px] md:flex-row`}>
              <FormItem className={`m-0 md:w-[180px]`}>
                <Button
                  onClick={() =>
                    dispatch(orderActions.switchStage("selectTime"))
                  }
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

          {/* ----------------以下為手動劃位彈窗---------------- */}
          {/* 選擇去程手動劃位 */}
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

          {/* 選擇回程手動劃位 */}
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
        </>
      )}
    </>
  );
};

export default SelectSeats;
