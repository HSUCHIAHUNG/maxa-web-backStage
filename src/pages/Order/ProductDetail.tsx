// 原生方法
import React from "react";
// redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../stores/index";
import { orderActions } from "../../stores/order";
// ui kit
import { Carousel, Tabs, Typography } from "@arco-design/web-react";
// 匯入樣式
import "../../assets/ProductDetail.css";
// 匯入組件
import Banner from "../../components/Carousel";
import SelectStation from "../../components/Order/selectStation";
import SelectTime from "../../components/Order/SelectTime";
import SelectSeats from "../../components/Order/SelectSeats";

// ui kit
const TabPane = Tabs.TabPane;

const ProductDetail: React.FC = () => {
  // ticket( 單程票、來回票 )狀態
  const ticketState = useSelector((state: RootState) => state.order.ticket);

  // redux(方法調用)
  const dispatch = useAppDispatch();

  // (單程票、來回票)切換狀態
  const switchTab = () => {
    dispatch(orderActions.switchTab());
    dispatch(orderActions.reseBbookingData());
  };

  // banner
  const imageSrc = [
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
  ];

  return (
    <div className={` px-[20px] pb-[16px] max-w-[1240px] m-[0_auto]`}>
      {/* 路線標題 */}
      <div className={` py-[16px] text-[20px] text-center `}>
        502 小烏來線(假日行駛)
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

      {/* 選擇日期與票數 */}
      {/* 標題 */}
      <div className={` flex gap-[8px] py-[20px] md:pt-[40px] xl:pt-[60px]`}>
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
              <SelectStation></SelectStation>
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
              <SelectStation></SelectStation>
              {/* 2. 選擇去回程時間 */}
              <SelectTime></SelectTime>
              {/* 3. 選擇座位 */}
              <SelectSeats></SelectSeats>
            </Typography.Paragraph>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
