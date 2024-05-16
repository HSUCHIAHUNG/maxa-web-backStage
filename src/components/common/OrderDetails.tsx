import React from "react";

interface OrderDetailsProps {
  title?: boolean;
  buttonState?: string;
  className?: string;
  totalTicketType?: { type: string; total: number }[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  title = true,
  className,
  totalTicketType = [],
  buttonState = "",
}) => {
  const isOpen = totalTicketType.every((item) => item === undefined);
  function ticketName(type: string) {
    if (type === "adult") return "成人票";
    if (type === "child") return "兒童票";
    if (type === "old") return "敬老票";
  }
  console.log(totalTicketType);
  return (
    <div
      className={`${className} overflow-hidden border border-solid border-[#E5E6EB] rounded-[8px] w-[100%] xl:h-[444px] xl:w-[320px]`}
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
        <div className={`pb-[20px]`}>
          格上租車券+阿里山門票+奮起湖經典三大美食三大美食三大美食三大奮起湖經典三大美食三大美食三大美食三大
        </div>
        {!isOpen && (
          <>
            {totalTicketType.map((item) => (
              <>
                {item !== undefined && (
                  <div className={`flex justify-between `}>
                    <p>
                      {ticketName(item.type)}*{item.total}
                    </p>
                    <p>NT$ 399*{item.total}</p>
                  </div>
                )}
              </>
            ))}
          </>
        )}
        {isOpen && (
          <div className={`flex justify-between`}>
            <p>成人票*2</p>
            <p>NT$ 399*2</p>
          </div>
        )}
        <div
          className={`border-b border-solid border-[#E5E6EB] w-full my-[8px] `}
        ></div>
        <div className={`flex justify-between text-[20px]`}>
          <p>總金額</p>
          <p>NT$798</p>
        </div>
        {/* 申請退款 */}
        <button
          className={`mt-[12px] px-[16px] py-[5px] w-full text-[#4E5969] bg-[#F2F3F5] `}
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
