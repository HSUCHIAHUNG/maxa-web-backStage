// 原生方法
import React from "react";
// router
import { useParams } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../stores/index";
import { orderActions } from "../../stores/order";
// 匯入型別
import { ProductDetailType } from "./type"
// ui kit
import { Carousel, Steps, Tabs, Typography } from "@arco-design/web-react";
// 匯入樣式
import "../../assets/ProductDetail.css";
// 匯入組件
import Banner from "../../components/Carousel";
import SelectStation from "../../components/Order/selectStation";
import SelectTime from "../../components/Order/SelectTime";
import SelectSeats from "../../components/Order/SelectSeats";
// json
import ProductDetailData from "../../assets/API/ProductDetail.json";

// ui kit
const TabPane = Tabs.TabPane;
const Step = Steps.Step;

// banner
const imageSrc = [
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
];

interface ProductDetailDataType {
  [key: string]: ProductDetailType;
}

const productDetailData: ProductDetailDataType = ProductDetailData;

const ProductDetail: React.FC = () => {
  // redux(方法調用)
  const dispatch = useAppDispatch();

  // ticket( 單程票、來回票 )狀態
  const ticketState = useSelector((state: RootState) => state.order.ticket);

  // 訂車階段(起訖站、日期、時間狀態))
  // const bookingStage = useSelector(
  //   (state: RootState) => state.order.bookingStage
  // );

  // 目前路由(動態參數)
  const { id } = useParams<{ id: string }>();

  // (單程票、來回票)切換狀態
  const switchTab = () => {
    dispatch(orderActions.switchTab());
    dispatch(orderActions.reseBbookingData());
  };

  if (!id) {
    return <div>無產品資訊</div>;
  } else {
    // 產品資料
    const product = productDetailData[id];

    dispatch(
      orderActions.orderContentStateChenge({
        title: "reserve",
        paymentState: "alreadyPaid",
        industryName: productDetailData[id].industry,
        routeName: product.name
      })
    );

    //  動態參數-未找到對應產品
    if (!product) {
      return <div>無產品資訊</div>;
    }

    return (
      <>
        <div className={` w-[80%] pb-[16px] max-w-[1240px] m-[0_auto]`}>
          {/* 路線標題 */}
          <div className={` py-[16px] text-[20px] text-center `}>
            {product.name}
          </div>

          {/* banner */}
          <Carousel
            className={`overflow-x-hidden max-w-[1200px] h-[500px] rounded-[16px] md:h-[320px] xl:h-[500px] `}
            autoPlay={true}
          >
            {imageSrc.map((src) => (
              <Banner key={src} src={src} />
            ))}
          </Carousel>

          {/* 訂票階段內容、路線圖外層 */}
          <div className={` flex gap-[20px] w-full`}>
            {/* 選擇日期與票數 */}
            <div className={`w-[70%]`}>
              {/* 標題 */}
              <div
                className={` flex gap-[8px] py-[20px] md:pt-[40px] xl:pt-[60px]`}
              >
                <span
                  className={`icon-[solar--ticket-bold-duotone] w-[24px] h-[24px] md:w-[32px] md:h-[32px] text-[#86909C]`}
                ></span>
                <p className={`text-[16px] md:text-[20px]`}>選擇日期與票數</p>
              </div>
              <Tabs
                defaultActiveTab={ticketState}
                type="card-gutter"
                onChange={switchTab}
              >
                <TabPane key="oneWayTicket" title="單程票">
                  {ticketState === "oneWayTicket" && (
                    <Typography.Paragraph>
                      {/* 1. 選擇站點、日期 */}
                      <SelectStation productDetail={product}></SelectStation>
                      {/* 2. 選擇去回程時間 */}
                      <SelectTime></SelectTime>
                      {/* 3. 選擇座位 */}
                      <SelectSeats></SelectSeats>
                    </Typography.Paragraph>
                  )}
                </TabPane>
                <TabPane key="roundTripTicket" title="來回票">
                  {ticketState === "roundTripTicket" && (
                    <Typography.Paragraph>
                      {/* 1. 選擇站點、日期 */}
                      <SelectStation productDetail={product}></SelectStation>
                      {/* 2. 選擇去回程時間 */}
                      <SelectTime></SelectTime>
                      {/* 3. 選擇座位 */}
                      <SelectSeats></SelectSeats>
                    </Typography.Paragraph>
                  )}
                </TabPane>
              </Tabs>
            </div>

            {/* 乘車路線圖 */}
            <div className={`w-[30%] `}>
              {/* 標題 */}
              <div
                className={` flex gap-[8px] py-[20px] md:pt-[40px] xl:pt-[60px]`}
              >
                <span
                  className={`icon-[solar--ticket-bold-duotone] w-[24px] h-[24px] md:w-[32px] md:h-[32px] text-[#86909C]`}
                ></span>
                <p className={`text-[16px] md:text-[20px]`}>乘車路線圖</p>
              </div>
              {/* 去程 */}
              <Tabs defaultActiveTab={ticketState} type="card-gutter">
                <TabPane key="oneWayTicket" title="去程">
                  <Typography.Paragraph>
                    <Steps
                      type="dot"
                      direction="vertical"
                      current={product.stations.length}
                      style={{ maxWidth: 780 }}
                    >
                      {product.stations.map((station, index) => (
                        <Step
                          key={index}
                          title={station}
                          // description={item.Comment || ""}
                        />
                      ))}
                    </Steps>
                  </Typography.Paragraph>
                </TabPane>
                {/* 回程 */}
                <TabPane key="roundTripTicket" title="回程">
                  <Typography.Paragraph>
                    <Steps
                      type="dot"
                      direction="vertical"
                      current={product.stations.length}
                      style={{ maxWidth: 780 }}
                    >
                      {product.stations.reverse().map((station, index) => (
                        <Step
                          key={index}
                          title={station}
                          // description={item.Comment || ""}
                        />
                      ))}
                    </Steps>
                  </Typography.Paragraph>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ProductDetail;