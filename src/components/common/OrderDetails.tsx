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
  title = true,
  className,
  // buttonState = "",
}) => {
  // 去程已選座位數
  const orderContent = useSelector(
    (state: RootState) => state.order.orderContent
  );
  console.log(orderContent);
  const { totalAmount } = orderContent;

  // 票數及種類
  const passengerTicket = useSelector(
    (state: RootState) => state.order.bookingData.passengerTicket
  );

  // 總票數及票種彙整
  const totalTicketType = [
    passengerTicket?.adult,
    passengerTicket?.child,
    passengerTicket?.old,
  ];

  // 產品名稱&路線資訊
  // const selectedProduct = useSelector(
  //   (state: RootState) => state.order.selectedProduct
  // );

  // 票種&票數
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

  return (
    <div
      className={`${className} overflow-hidden border border-solid border-[#E5E6EB] rounded-[8px] w-[100%] xl:h-[424px] xl:w-[320px]`}
    >
      {title && (
        <div className={`flex justify-between py-[11px] px-[16px]`}>
          <p>預約日期</p>
          <p>2024-04-21</p>
        </div>
      )}
      <img
        src={
          "https://ohh.okinawa/wpdir/wp-content/uploads/2018/07/59827ddcc6f8f06485fad8836fb30162.jpg"
        }
        alt={"productDetail"}
        className=" w-[100%] object-cover h-[200px]"
      />
      <div className="w-[100%] p-[16px] flex flex-col justify-between ">
        <div className={`pb-[20px] text-[20px]`}>506 東眼山線</div>
        {orderContent.title === "reserve" && (
          <>
            {/* <div className={`pb-[20px]`}>{selectedProduct.route}</div> */}
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
        {orderContent.title !== "reserve" && (
          <>
            <div className={`flex justify-between`}>
              <p>成人票*2</p>
              <p>NT$ 399*2</p>
            </div>
          </>
        )}

        <div
          className={`border-b border-solid border-[#E5E6EB] w-full my-[8px] `}
        ></div>

        <div className={`flex justify-between text-[20px]`}>
          <p>總金額</p>
          <p>NT$ {totalAmount}</p>
        </div>
        {/* 申請退款 */}
        <button
          className={`mt-[20px] px-[16px] py-[5px] w-full text-[#4E5969] bg-[#F2F3F5] `}
        >
          申請退款
        </button>

        {/* 已付款 */}
        {/* {buttonState === "pendingPayment" && (
          <button
            className={`mt-[12px] px-[16px] py-[5px] w-full text-[#fff] bg-[#3A57E8] `}
          >
            確認付款
          </button>
        )} */}
        {/* 已失效 */}
        {/* {buttonState === 'expired' && (
          <button
            className={`mt-[12px] px-[16px] py-[5px] w-full text-[#fff] bg-[#3A57E8] `}
          >
            再次預定
          </button>
        )} */}
      </div>
    </div>
  );
};

export default OrderDetails;
