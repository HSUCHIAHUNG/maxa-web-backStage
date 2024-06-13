import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/index";
import { orderActions } from "../../stores/order";
import { ProductDetailType } from "./type";
import { Carousel, Steps, Tabs, Typography } from "@arco-design/web-react";
import "../../assets/css/ProductDetail.css";
import Banner from "../../components/Carousel";
import SelectStation from "../../components/Order/selectStation";
import SelectTime from "../../components/Order/SelectTime";
import SelectSeats from "../../components/Order/SelectSeats";
import ProductDetailData from "../../assets/API/ProductDetail.json";
import { IconLocation } from "@arco-design/web-react/icon";
const TabPane = Tabs.TabPane;
const Step = Steps.Step;

interface ProductDetailDataType {
  [key: string]: ProductDetailType;
}
const productDetailData: ProductDetailDataType = ProductDetailData;

const ProductDetail: React.FC = () => {
  const dispatch = useDispatch();
  const ticketState = useSelector((state: RootState) => state.order.ticket);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id && productDetailData[id]) {
      const product = productDetailData[id];
      dispatch(
        orderActions.orderContentStateChenge({
          title: "reserve",
          paymentState: "alreadyPaid",
          industryName: product.industry,
          routeName: product.name,
        })
      );
    }
  }, [id, dispatch]);

  if (!id) {
    return <div>無產品資訊</div>;
  }

  const product = productDetailData[id];

  if (!product) {
    return <div>無產品資訊</div>;
  }

  const switchTab = () => {
    dispatch(orderActions.switchTab());
    dispatch(orderActions.resetBookingData());
  };

  return (
    <div className={`w-[75%] pb-[16px] max-w-[1240px] m-[0_auto]`}>
      <div className={`py-[16px] text-[20px] text-center`}>{product.name}</div>

      <Carousel
        className={`overflow-x-hidden max-w-[1200px] h-[500px] rounded-[16px] md:h-[320px] xl:h-[500px]`}
        autoPlay={true}
      >
        {product.banner.map((item) => (
          <Banner key={item.id} src={item.url} />
        ))}
      </Carousel>

      <div className={`flex gap-[20px] w-full`}>
        <div className={`w-[70%]`}>
          <div className={`flex gap-[8px] py-[20px] md:pt-[40px] xl:pt-[60px]`}>
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
                  <SelectStation productDetail={product}></SelectStation>
                  <SelectTime></SelectTime>
                  <SelectSeats></SelectSeats>
                </Typography.Paragraph>
              )}
            </TabPane>
            <TabPane key="roundTripTicket" title="來回票">
              {ticketState === "roundTripTicket" && (
                <Typography.Paragraph>
                  <SelectStation productDetail={product}></SelectStation>
                  <SelectTime></SelectTime>
                  <SelectSeats></SelectSeats>
                </Typography.Paragraph>
              )}
            </TabPane>
          </Tabs>
        </div>

        <div className={`w-[30%]`}>
          <div className={`flex gap-[8px] py-[20px] md:pt-[40px] xl:pt-[60px]`}>
            <span
              className={`icon-[solar--ticket-bold-duotone] w-[24px] h-[24px] md:w-[32px] md:h-[32px] text-[#86909C]`}
            ></span>
            <p className={`text-[16px] md:text-[20px]`}>乘車路線圖</p>
          </div>
          <Tabs defaultActiveTab={ticketState} type="card-gutter">
            <TabPane key="oneWayTicket" title="去程">
              <Typography.Paragraph>
                <Steps
                  type="dot"
                  direction="vertical"
                  current={product.stations.length}
                  style={{ maxWidth: 780 }}
                >
                  {product.stations.map((station) => (
                    <Step
                      key={station.id}
                      title={station.name}
                      icon={<IconLocation />}
                    />
                  ))}
                </Steps>
              </Typography.Paragraph>
            </TabPane>
            <TabPane key="roundTripTicket" title="回程">
              <Typography.Paragraph>
                <Steps
                  type="dot"
                  direction="vertical"
                  current={product.stations.length}
                  style={{ maxWidth: 780 }}
                >
                  {product.stations.reverse().map((station) => (
                    <Step
                      key={station.id}
                      title={station.name}
                      icon={<IconLocation />}
                    />
                  ))}
                </Steps>
              </Typography.Paragraph>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
