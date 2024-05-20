import React from "react";
// redux
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.ts";

interface OrderDetailsProps {
  title?: boolean;
  buttonState?: string;
  className?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  className,
}) => {

  // 去程已選座位數
  const orderContent = useSelector(
    (state: RootState) => state.order.orderContent
  );

  // 票數及種類(成人、孩童、敬老票)
  const passengerTicket = useSelector(
    (state: RootState) => state.order.bookingData.passengerTicket
  );

  // 總票數及票種彙整(成人、孩童、敬老票)總數計算
  const totalTicketType = [
    passengerTicket?.adult,
    passengerTicket?.child,
    passengerTicket?.old,
  ];

  // 產品名稱&路線資訊(預約訂單產品內容title)
  const selectedProduct = useSelector(
    (state: RootState) => state.order.selectedProduct
  );

  // 票種&票數(轉換票種名稱)
  function ticketName(type: string) {
    if (type === "adult") return "成人票";
    if (type === "child") return "兒童票";
    if (type === "old") return "敬老票";
  }

  // 票價篩選
  function ticketPrice(type: string) {
    if (type === "adult") return 100;
    if (type === "child") return 80;
    if (type === "old") return 80;
  }

  // 動態顯示按鈕狀態
  const buttonState = () => {
    switch (orderContent.paymentState) {
      case "alreadyPaid":
        return (
          <button
            className={`mt-[20px] px-[16px] py-[5px] w-full text-[#4E5969] bg-[#F2F3F5] `}
          >
            申請退款
          </button>
        );
      case "pendingPayment":
        return (
          <button
            className={`mt-[20px] px-[16px] py-[5px] w-full text-[#4E5969] bg-[#F2F3F5] `}
          >
            取消訂單
          </button>
        );
      default:
        break;
    }
  };

  return (
    <div
      className={`${className} overflow-hidden border border-solid border-[#E5E6EB] rounded-[8px] w-[100%] xl:h-[424px] xl:w-[320px]`}
    >
      {/* 商品圖片 */}
      <img
        src={
          "https://ohh.okinawa/wpdir/wp-content/uploads/2018/07/59827ddcc6f8f06485fad8836fb30162.jpg"
        }
        alt={"productDetail"}
        className=" w-[100%] object-cover h-[200px]"
      />
      <div className="w-[100%] p-[16px] flex flex-col justify-between ">
        {/* 預約-商品明細 */}
        {orderContent.title === "reserve" && (
          <>
            <div className={`pb-[20px] text-[20px]`}>
              {selectedProduct.route}
            </div>
            {totalTicketType.map((item, index) => (
              <div key={index}>
                {item.total !== 0 && (
                  <div className={`flex justify-between `}>
                    <p>
                      {ticketName(item.type)}*{item.total}
                    </p>
                    <p>
                      NT$ {ticketPrice(item.type)}*{item.total}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* 訂單紀錄-商品明細 */}
        {orderContent.title === 'orderHistory' && (
          <>
            <div className={`pb-[20px] text-[20px]`}>506 東眼山線</div>
            <div className={`flex justify-between`}>
              <p>成人票*2</p>
              <p>NT$ 399*2</p>
            </div>
          </>
        )}
        {/* 下畫線 */}
        <div
          className={`border-b border-solid border-[#E5E6EB] w-full my-[8px] `}
        ></div>

        {/* 商品總金額 */}
        <div className={`flex justify-between text-[20px]`}>
          <p>總金額</p>
          <p>NT$ {orderContent.totalAmount}</p>
        </div>
        {/* 依照按鈕切換按鈕狀態 */}
        {buttonState()}
      </div>
    </div>
  );
};

export default OrderDetails;
