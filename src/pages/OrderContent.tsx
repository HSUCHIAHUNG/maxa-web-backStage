// react原生方法
import React, { useEffect, useRef, useState } from "react";
// router
import { useParams } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../stores/index.ts";
// redux
import { orderActions } from "../stores/order";
// ui kit
import {
  Alert,
  Modal,
  Steps,
  Form,
  Input,
  InputNumber,
  Message,
} from "@arco-design/web-react";
import Step from "@arco-design/web-react/es/Steps/step";
// 匯入組件
import OrderDetails from "../components/common/OrderDetails";
import PassengerInfo from "../components/Order/PassengerInfo.tsx";
// 匯入圖片
import selectSeats from "../assets/images/memberCenter/selectSeats.png";

// 乘客資料
const passenger = [
  {
    title: "訂購人資料",
    name: "李曉明",
    id: "H124803061",
    phone: "+886 912312312",
    email: "h0989541161@example.com",
  },
  {
    title: "取票人資料",
    name: "李小花",
    id: "H124805066",
    phone: "+886 912315312",
    email: "-----",
  },
  {
    title: "搭乘人資料_1",
    name: "李偉銘",
    id: "H124803066",
    phone: "+886 912312316",
    email: "-----",
  },
  {
    title: "搭乘人資料_2",
    name: "陳曉明",
    id: "-----",
    phone: "+886 912312313",
    email: "-----",
  },
];

const OrderContent: React.FC = () => {
  // redux方法呼叫
  const dispatch = useAppDispatch();

  // ui kit
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const TextArea = Input.TextArea;

  // 目前路由(動態參數)
  const { id } = useParams<{ id: string }>();

  // 退款modal狀態
  const [refundVisible, setRefundVisible] = React.useState(false);

  // 訂單資料
  const bookingData = useSelector(
    (state: RootState) => state.order.bookingData
  );

  // 單程票or來回票
  const tabState = useSelector((state: RootState) => state.order.ticket);

  // 訂單付款狀態
  const orderContent = useSelector(
    (state: RootState) => state.order.orderContent
  );

  const { paymentState, remarks, paymentMethod } = orderContent;

  // 退款金額計算狀態
  const [refundCalcState, setRefundCalcState] = useState({
    orderAmount: 798,
    refundAmount: 0,
  });
  const [deduction, setDeduction] = useState<number>(0);
  const [handlingFee, setHandlingFee] = useState<number>(0);
  const [otherFee, setOtherFee] = useState<number>(0);

  //
  const orderDetailsRef = useRef<HTMLDivElement>(null);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (orderDetailsRef.current) {
        const rect = orderDetailsRef.current.getBoundingClientRect();
        setIsSticky(rect.top < -320);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 初始调用，以防止页面刷新时状态不正确
    handleScroll();

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 付款狀態樣式動態設定
  const paymentStateFilter = () => {
    switch (orderContent.paymentState) {
      case "alreadyPaid":
        return (
          <Alert
            type="info"
            showIcon={false}
            content={
              <div className={`flex gap-[8px] items-center justify-center`}>
                <span className="icon-[majesticons--alert-circle] text-[#3A57E8] "></span>
                <p>已付款</p>
              </div>
            }
            className={` justify-center`}
          />
        );
      case "refund":
        return (
          <Alert
            type="warning"
            showIcon={false}
            content={
              <div className={`flex gap-[8px] items-center justify-center`}>
                <span className="icon-[majesticons--alert-circle] text-[#FF7D00] "></span>
                <p>申請退款中</p>
              </div>
            }
            className={` justify-center`}
          />
        );
      case "activeComplate":
        return (
          <Alert
            type="success"
            showIcon={false}
            content={
              <div className={`flex gap-[8px] items-center justify-center`}>
                <span className="icon-[majesticons--alert-circle] text-[#00B42A] "></span>
                <p>已完成活動</p>
              </div>
            }
            className={`justify-center`}
          />
        );
      case "pendingPayment":
        return (
          <Alert
            showIcon={false}
            content={
              <div className={`flex gap-[8px] items-center justify-center`}>
                <span className="icon-[majesticons--alert-circle] text-[#EC4A58] "></span>
                <p>待付款</p>
              </div>
            }
            className={` justify-center bg-[#FFEAE8]`}
          />
        );
      default:
        return (
          <Alert
            showIcon={false}
            content={
              <div className={`flex gap-[8px] items-center justify-center`}>
                <span className="icon-[majesticons--alert-circle] text-[#808EB0] "></span>
                <p>{orderContent.paymentState}</p>
              </div>
            }
            className={` justify-center bg-[#E5E6EB]`}
          />
        );
    }
  };

  const checkoutDetailsStateFilter = () => {
    return (
      <Alert
        showIcon={false}
        content={
          <div className={`flex gap-[8px] items-center justify-center`}>
            <span className="icon-[majesticons--alert-circle] text-[#3A57E8] "></span>
            <p>{orderContent.paymentState}</p>
          </div>
        }
        className={` justify-center bg-[#E8F0FF]`}
      />
    );
  };

  // 計算退款金額
  const calcAmount = (value: number, type: string) => {
    const newDeduction = type === "deduction" ? value : deduction;
    const newHandlingFee = type === "handlingFee" ? value : handlingFee;
    const newOtherFee = type === "otherFee" ? value : otherFee;
    const newRefundAmount =
      refundCalcState.orderAmount - newDeduction - newHandlingFee - newOtherFee;

    if (newRefundAmount < 0 || newRefundAmount > 798) {
      Message.warning("退款金額錯誤");
    }

    if (isNaN(newRefundAmount) || newRefundAmount < 0) {
      setRefundCalcState((prevState) => ({
        ...prevState,
        refundAmount: 0,
      }));
      if (type === "deduction") {
        setDeduction(0);
      } else if (type === "handlingFee") {
        setHandlingFee(0);
      } else if (type === "otherFee") {
        setOtherFee(0);
      }
      return;
    }

    if (type === "deduction") {
      setDeduction(value);
    } else if (type === "handlingFee") {
      setHandlingFee(value);
    } else if (type === "otherFee") {
      setOtherFee(value);
    }

    setRefundCalcState((prevState) => ({
      ...prevState,
      refundAmount: newRefundAmount,
    }));
  };

  // 送出退款表單
  const submit = () => {
    if (
      refundCalcState.refundAmount > 0 &&
      refundCalcState.refundAmount < 798
    ) {
      Message.success("退款完成");
      dispatch(
        orderActions.orderContentStateChenge({
          title: "orderHistory",
          paymentState: "已退款",
        })
      );
      setRefundVisible(false);
    } else {
      Message.warning("請確認退款金額");
    }
  };

  return (
    <div className={`flex flex-col w-full`}>
      <div
        className={
          isSticky
            ? "sticky flex justify-between items-center top-0 bg-[#fff] w-full z-[100] shadow-md h-[52px] px-[12px] md:px-[20px] duration-300 transition-all"
            : " h-0"
        }
      >
        <p>{orderContent.routeName}</p>
        <p>{orderContent.title !== "reserve" && "NT$798"}</p>
        {orderContent.title === "reserve" && (
          <p>
            <span className={`pr-[4px]`}>NT$</span>
            {tabState === "roundTripTicket" && orderContent.totalAmount
              ? +orderContent.totalAmount * 2
              : orderContent.totalAmount}
          </p>
        )}
      </div>

      {/* 預約 */}
      {orderContent.title === "reserve" && (
        <>
          {/* 已付款等待使用 */}
          {paymentStateFilter()}
        </>
      )}

      {/* 訂單紀錄 */}
      {orderContent.title === "orderHistory" && (
        <>
          {/* 已付款 */}
          {paymentStateFilter()}
        </>
      )}

      {/* 每日結帳明細查詢 */}
      {orderContent.title === "CheckoutDetails" && (
        <>{checkoutDetailsStateFilter()}</>
      )}

      {/* 主內容 */}
      <div className="max-w-[1200px] m-[0_auto] md:px-[24px] px-[20px] w-[960px]">
        <div className="flex !w-full flex-col gap-[16px] mb-[20px] md:my-[20px] md:gap-[20px] md:w-[560px] xl:flex-row-reverse xl:w-[900px]">
          {/* 訂單明細 */}
          <div ref={orderDetailsRef}>
            <OrderDetails
              buttonState={paymentState}
              title={false}
              className="border-b rounded-none md:border md:border-solid md:border-[#E5E6EB] md:rounded-[8px]"
            />
          </div>

          <div
            className={` flex flex-col gap-[16px] md:gap-[20px] xl:w-[700px]`}
          >
            {/* 訂單詳情 */}
            <ul
              className={`bg-[#fff] w-full border-y border-solid border-[#E5E6EB] py-[20px] px-[16px] flex flex-col gap-[12px] md:gap-[20px] md:border md:rounded-[16px] md:p-[40px] `}
            >
              <li className={`text-[20px] `}>訂單詳情</li>
              <li
                className={`border border-solid border-[#E5E6EB] rounded-[4px] md:rounded-[8px] overflow-hidden`}
              >
                {/* 訂單編號 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>訂單編號</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>{id}</p>
                  </div>
                </div>

                {/* 訂購時間 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px] pb-[8px] `}>訂購時間</p>
                  </div>
                  <div className={`md:py-[9px] md:px-[20px] md:w-full`}>
                    2024-04-21 12:12:12
                  </div>
                </div>

                {/* 備註 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px] pb-[8px] `}>備註</p>
                  </div>
                  <div className={`md:py-[9px] md:px-[20px] md:w-full`}>
                    -----
                  </div>
                </div>

                {/* 備註 */}
                {remarks && (
                  <div
                    className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                  >
                    <div
                      className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                    >
                      <p className={`w-[112px] `}>備註</p>
                    </div>
                    <div
                      className={`md:py-[9px] md:px-[20px] md:w-full md:border-b md:border-solid md:border-[#E5E6EB]`}
                    >
                      <p className={``}>{remarks}</p>
                    </div>
                  </div>
                )}
              </li>
            </ul>

            {/* 付款資料 */}
            <ul
              className={`bg-[#fff] w-full border-y border-solid border-[#E5E6EB] py-[20px] px-[16px] flex flex-col gap-[12px] md:gap-[20px] md:border md:rounded-[16px] md:p-[40px] `}
            >
              <li className={`text-[20px] `}>付款資料</li>
              <li
                className={`border border-solid border-[#E5E6EB] rounded-[4px] md:rounded-[8px] overflow-hidden`}
              >
                {/* 付款方式 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>付款方式</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>{paymentMethod === "" && "信用卡"}</p>
                  </div>
                </div>

                {/* 信用卡卡號 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>信用卡卡號</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>510540**2468</p>
                  </div>
                </div>

                {/* 授權碼 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>授權碼</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>666</p>
                  </div>
                </div>

                {/* 交易流程 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>交易流程</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <Steps
                      type="dot"
                      direction="vertical"
                      current={7}
                      style={{ maxWidth: 780 }}
                    >
                      <Step
                        title={`付款時間`}
                        description={`2024-12-12 12:12:12`}
                      />
                      <Step
                        title={`驗證支付`}
                        description={`2024-12-12 12:12:12`}
                      />
                      <Step
                        title={`提交交易`}
                        description={`2024-12-12 12:12:12`}
                      />
                      <Step
                        title={`提交授權申請`}
                        description={`2024-12-12 12:12:12`}
                      />
                      <Step
                        title={`獲得授權`}
                        description={`2024-12-12 12:12:12`}
                      />
                      <Step
                        title={`向商戶付款`}
                        description={`2024-12-12 12:12:12`}
                      />
                      {orderContent.paymentState === "已退款" && (
                        <Step
                          title={`已退款`}
                          description={`2024-12-12 12:12:12`}
                        />
                      )}
                    </Steps>
                  </div>
                </div>

                {/* 退款 */}
                {(orderContent.paymentState === "alreadyPaid" ||
                  orderContent.paymentState === "refund") &&
                  orderContent.title !== "reserve" && (
                    <div
                      className={`border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                    >
                      <div
                        className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                      >
                        <p className={`w-[112px]`}>退款</p>
                      </div>
                      <div
                        className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                      >
                        <button
                          onClick={() => setRefundVisible(true)}
                          className={`px-[16px] py-[5px] w-fit bg-[#F1F2F8] text-[#485781] `}
                        >
                          退款
                        </button>
                      </div>
                    </div>
                  )}

                {/* 繳款人統編或ID */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>繳款人統編或ID</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>------</p>
                  </div>
                </div>

                {/* 備註 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>備註</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>------</p>
                  </div>
                </div>
              </li>
            </ul>

            {/* 車票相關 */}
            <ul
              className={`bg-[#fff] w-full border-y border-solid border-[#E5E6EB] py-[20px] px-[16px] flex flex-col gap-[12px] md:gap-[20px] md:border md:rounded-[16px] md:p-[40px] `}
            >
              <li className={` text-[20px] `}>車票相關</li>
              <li
                className={`border border-solid border-[#E5E6EB] rounded-[4px] md:rounded-[8px] overflow-hidden`}
              >
                {/* 去程班次 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>去程班次</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>0001</p>
                  </div>
                </div>

                {/* 去程時間 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>去程時間</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <Steps
                      type="dot"
                      direction="vertical"
                      current={2}
                      style={{ maxWidth: 780 }}
                    >
                      <Step
                        title={
                          orderContent.title === "reserve"
                            ? bookingData?.stationData?.startStation
                            : "大溪總站"
                        }
                        description={
                          orderContent.title === "reserve"
                            ? ` ${bookingData?.stationData?.startDate} ${bookingData?.timeData?.startTime?.startStation}`
                            : "2024-05-13 10:05"
                        }
                      />
                      <Step
                        title={
                          orderContent.title === "reserve"
                            ? bookingData?.stationData?.endStation
                            : "慈湖"
                        }
                        description={
                          orderContent.title === "reserve"
                            ? ` ${bookingData?.stationData?.startDate} ${bookingData?.timeData?.startTime?.endStation}`
                            : "2024-05-13 11:00"
                        }
                      />
                    </Steps>
                  </div>
                </div>

                {/* 去程座位 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px] `}>去程座位</p>
                  </div>
                  <div
                    className={`flex justify-center md:py-[9px] md:px-[20px] md:w-full`}
                  >
                    <img src={selectSeats} alt="座位" />
                  </div>
                </div>

                {/* 回程班次 */}
                {tabState === "roundTripTicket" &&
                  orderContent.title === "reserve" && (
                    <div
                      className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                    >
                      <div
                        className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                      >
                        <p className={`w-[112px]`}>回程班次</p>
                      </div>
                      <div
                        className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                      >
                        <p className={``}>0002</p>
                      </div>
                    </div>
                  )}

                {/* 回程時間 */}
                {tabState === "roundTripTicket" &&
                  orderContent.title === "reserve" && (
                    <div
                      className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                    >
                      <div
                        className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                      >
                        <p className={`w-[112px]`}>回程時間</p>
                      </div>
                      <div
                        className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                      >
                        <Steps
                          type="dot"
                          direction="vertical"
                          current={2}
                          style={{ maxWidth: 780 }}
                        >
                          <Step
                            title={bookingData?.stationData?.endStation}
                            description={`${bookingData?.stationData?.startDate} ${bookingData.timeData.startTime}`}
                          />
                          <Step
                            title={bookingData?.stationData?.startStation}
                            description="2024-05-20 11:00"
                          />
                        </Steps>
                      </div>
                    </div>
                  )}

                {/* 回程座位 */}
                {tabState === "roundTripTicket" &&
                  orderContent.title === "reserve" && (
                    <div
                      className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                    >
                      <div
                        className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                      >
                        <p className={`w-[112px] `}>回程座位</p>
                      </div>
                      <div
                        className={`flex justify-center md:py-[9px] md:px-[20px] md:w-full`}
                      >
                        <img src={selectSeats} alt="座位" />
                      </div>
                    </div>
                  )}
              </li>
            </ul>

            {/* 乘客資料 */}
            {orderContent.title !== "reserve" && (
              <>
                {passenger.map((item) => (
                  <PassengerInfo key={item.id} passenger={item} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 退款modal */}
      <Modal
        title="退款"
        visible={refundVisible}
        onOk={() => form.submit()}
        onCancel={() => setRefundVisible(false)}
        okText="送出"
        autoFocus={false}
        focusLock={true}
        className={`w-fit`}
      >
        <div className={`text-[#485781]`}>
          <Form
            form={form}
            onSubmit={submit}
            autoComplete="on"
            requiredSymbol={{ position: "start" }}
            layout="vertical"
          >
            <div className={`flex flex-row items-start h-[82px]`}>
              {/* 訂單金額 */}
              <div className={`w-[120px] h-[56px]`}>
                <p>訂單金額</p>
                <p className={`text-[24px] `}>{refundCalcState.orderAmount}</p>
              </div>

              {/* 減號 */}
              <div
                className={`bg-[#F1F2F8] w-[20px] h-[20px] mx-[12px] mt-[35.5px]  `}
              >
                <span className="icon-[pepicons-pop--minus] w-full h-full "></span>
              </div>

              {/* 退票扣款金額 */}
              <FormItem
                label="退票扣款金額"
                field="deduction"
                rules={[{ required: true, message: "必填" }]}
                className={`m-0 md:w-[138px] `}
              >
                <InputNumber
                  onChange={(value) => calcAmount(value, "deduction")}
                  value={deduction}
                  min={0}
                  placeholder="0"
                />
              </FormItem>

              {/* 減號 */}
              <div
                className={`bg-[#F1F2F8] w-[20px] h-[20px] mx-[12px] mt-[35.5px]  `}
              >
                <span className="icon-[pepicons-pop--minus] w-full h-full "></span>
              </div>

              {/* 退票手續費 */}
              <FormItem
                label="退票手續費"
                field="handlingFee"
                rules={[{ required: true, message: "必填" }]}
                className={`m-0 md:w-[138px] `}
              >
                <InputNumber
                  value={handlingFee}
                  onChange={(value) => calcAmount(value, "handlingFee")}
                  min={0}
                  placeholder="0"
                />
              </FormItem>

              {/* 減號 */}
              <div
                className={`bg-[#F1F2F8] w-[20px] h-[20px] mx-[12px] mt-[35.5px]  `}
              >
                <span className="icon-[pepicons-pop--minus] w-full h-full "></span>
              </div>

              {/* 其他 */}
              <FormItem
                label="其他"
                field="otherFee"
                rules={[{ required: true, message: "必填" }]}
                className={`m-0 md:w-[138px] `}
              >
                <InputNumber
                  value={otherFee}
                  onChange={(value) => calcAmount(value, "otherFee")}
                  min={0}
                  placeholder="0"
                />
              </FormItem>

              {/* 等號 */}
              <div
                className={`bg-[#F1F2F8] w-[20px] h-[20px] mx-[12px] mt-[35.5px]  `}
              >
                <span className="icon-[pepicons-pop--equal] w-full h-full "></span>
              </div>

              {/* 實際退款金額 */}
              <div className={`w-[120px] h-[56px]`}>
                <p>實際退款金額</p>
                <p className={`text-[24px] `}>{refundCalcState.refundAmount}</p>
              </div>
            </div>
            <FormItem label="備註" field="remark">
              <TextArea
                placeholder="Please enter ..."
                maxLength={{ length: 50 }}
                showWordLimit
                className={`w-full`}
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default OrderContent;
