// react原生方法
import React from "react";
// router
import { useParams } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState } from "../stores/index.ts";
// ui kit
import { Alert, Steps } from "@arco-design/web-react";
import Step from "@arco-design/web-react/es/Steps/step";
// 匯入組件
import OrderDetails from "../components/common/OrderDetails";
import PassengerInfo from "../components/Order/PassengerInfo.tsx";
// 匯入圖片
import selectSeats from "../assets/images/memberCenter/selectSeats.png";
// data
import moment from "moment";

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
  // const dispatch = useAppDispatch();

  // 目前路由(動態參數)
  const { id } = useParams<{ id: string }>();

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
  console.log(orderContent);

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
                <p>已付款，等待使用</p>
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

  return (
    <div className={`flex flex-col w-full`}>
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
      <div className={` max-w-[1200px] m-[0_auto] md:px-[24px] px-[20px] `}>
        <div
          className={`flex !w-full flex-col gap-[16px] mb-[20px] md:my-[20px] md:gap-[20px] md:w-[560px] xl:flex-row-reverse xl:w-[900px] `}
        >
          {/* 訂單明細 */}
          <OrderDetails
            buttonState={paymentState}
            title={false}
            className={`border-b rounded-none md:border md:border-solid md:border-[#E5E6EB] md:rounded-[8px] `}
          ></OrderDetails>
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

                {/* 業者 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px]`}>業者</p>
                  </div>
                  <div
                    className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
                  >
                    <p className={``}>
                      {orderContent.industryName?.length === 0
                        ? "桃園客運"
                        : orderContent.industryName}
                    </p>
                  </div>
                </div>

                {/* 訂單流程 */}
                <div
                  className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
                >
                  <div
                    className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
                  >
                    <p className={`w-[112px] pb-[8px] `}>訂單流程</p>
                  </div>
                  <div className={`md:py-[9px] md:px-[20px] md:w-full`}>
                    <Steps
                      type="dot"
                      direction="vertical"
                      current={1}
                      style={{ maxWidth: 780 }}
                    >
                      <Step
                        title="付款時間"
                        description={moment().format("YYYY-MM-DD HH:mm:ss")}
                      />
                      <Step title="等待使用" description="------" />
                    </Steps>
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
                      current={2}
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
                    </Steps>
                  </div>
                </div>

                {/* 繳款人統編或ID */}
                {orderContent.title !== "reserve" && (
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
                )}

                {/* 備註 */}
                {orderContent.title !== "reserve" && (
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
                )}
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
    </div>
  );
};

export default OrderContent;
