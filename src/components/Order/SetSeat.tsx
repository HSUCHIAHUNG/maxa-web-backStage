import React, { useRef, useState } from "react";
// redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../stores/index";
// 匯入組件
import Mask from "../common/Mask";
// 匯入圖片
import SeatsBg from "../../assets/images/order/bus.png";
import sear_n from "../../assets/images/order/seat_n.png";
import seat_s from "../../assets/images/order/seat_s.png";
import seat_d from "../../assets/images/order/seat_d.png";
import driver from "../../assets/images/order/driver.png";
// import save from "../../assets/images/order/save.png";
import istairs from "../../assets/images/order/istairs.png";
import exit from "../../assets/images/order/exit.png";
import { Icon, Message } from "@arco-design/web-react";
import { orderActions } from "../../stores/order";

interface SetSeatProps {
  isSetSeats: boolean;
  setIsSetSeats: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; ticketState: string }>
  >;
  ticketState: string;
}

interface SeatDataType {
  id: number;
  type: string;
  name: string | null;
}

const IconFont = Icon.addFromIconFontCn({
  src: "//at.alicdn.com/t/font_180975_26f1p759rvn.js",
});

const SetSeat: React.FC<SetSeatProps> = ({
  isSetSeats,
  setIsSetSeats,
  ticketState,
}) => {
  // redux(方法調用)
  const dispatch = useAppDispatch();

  // 提示訊息
  // const [seatMessage, setSeatMessage] = useState(false);

  // 儲存已選座位數
  const [tempSelectSeats, setTempSelectSeats] = useState(0);

  // 暫存已選擇座位待送出確認後存進redux
  const tempSelectSeatsRef = useRef<SeatDataType[]>([]);

  // 座位列表的狀態
  const [seatArr, setSeatArr] = useState([
    { id: 1, type: "driver", name: null },
    { id: 2, type: "null", name: null },
    { id: 3, type: "null", name: null },
    { id: 4, type: "null", name: null },
    { id: 5, type: "istairs", name: null },
    { id: 6, type: "sear_n", name: "A1" },
    { id: 7, type: "sear_n", name: "B1" },
    { id: 8, type: "null", name: null },
    { id: 9, type: "null", name: null },
    { id: 10, type: "sear_n", name: "E1" },
    { id: 11, type: "sear_n", name: "A2" },
    { id: 12, type: "sear_n", name: "B2" },
    { id: 13, type: "null", name: null },
    { id: 14, type: "null", name: null },
    { id: 15, type: "seat_d", name: null },

    { id: 16, type: "sear_n", name: "A3" },
    { id: 17, type: "sear_n", name: "B3" },
    { id: 18, type: "null", name: null },
    { id: 19, type: "null", name: null },
    { id: 20, type: "seat_d", name: null },

    { id: 21, type: "sear_n", name: "A4" },
    { id: 22, type: "sear_n", name: "B4" },
    { id: 23, type: "null", name: null },
    { id: 24, type: "null", name: null },
    { id: 25, type: "sear_n", name: "E4" },

    { id: 26, type: "exit", name: null },
    { id: 27, type: "null", name: null },
    { id: 28, type: "null", name: null },
    { id: 29, type: "null", name: null },
    { id: 30, type: "istairs", name: null },

    { id: 31, type: "sear_n", name: "A5" },
    { id: 32, type: "sear_n", name: "B5" },
    { id: 33, type: "null", name: null },
    { id: 34, type: "sear_n", name: "D5" },
    { id: 35, type: "sear_n", name: "E5" },

    { id: 36, type: "sear_n", name: "A6" },
    { id: 37, type: "sear_n", name: "B6" },
    { id: 38, type: "null", name: null },
    { id: 39, type: "sear_n", name: "D6" },
    { id: 40, type: "sear_n", name: "E6" },

    { id: 41, type: "sear_n", name: "A7" },
    { id: 42, type: "sear_n", name: "B7" },
    { id: 43, type: "null", name: null },
    { id: 44, type: "sear_n", name: "D7" },
    { id: 45, type: "sear_n", name: "E7" },

    { id: 46, type: "sear_n", name: "A8" },
    { id: 47, type: "sear_n", name: "B8" },
    { id: 48, type: "null", name: null },
    { id: 49, type: "sear_n", name: "D8" },
    { id: 50, type: "sear_n", name: "E8" },
  ]);

  // 乘客票數
  const passengerTicket = useSelector(
    (state: RootState) => state.order.bookingData.passengerTicket
  );

  // 已選乘客總數
  const passengerTicketTotal = Object.values(passengerTicket).reduce(
    (acc, obj) => acc + obj.total,
    0
  );

  const bookingData = useSelector(
    (state: RootState) => state.order.bookingData
  );
  console.log(bookingData);
  // 設定座位icon
  const setSeatImg = (type: string | null) => {
    if (type === "driver") return driver;
    if (type === "seat_s") return seat_s;
    if (type === "seat_d") return seat_d;
    if (type === "istairs") return istairs;
    if (type === "exit") return exit;
    return sear_n;
  };

  // 提交訂單跳轉頁面到合約頁面
  function submitSetSeat() {
    if (passengerTicketTotal < tempSelectSeats) {
      Message.error("訂位數超過票數");
      return;
    }
    if (passengerTicketTotal === tempSelectSeats) {
      Message.success({
        icon: <IconFont type="icon-success" />,
        content: "劃位成功",
      });
      // 關閉談窗
      setIsSetSeats((prevState) => ({
        ...prevState,
        isOpen: !prevState.isOpen,
      }));
      // TODO:如果票數與座位數一樣就跳通過，將資料存進Redux(要標示回程還是去程)，並且關閉視窗。
      dispatch(
        orderActions.setSeatsData([
          tempSelectSeatsRef.current,
          ticketState === "選擇去程座位" ? "oneWayTicket" : "roundTripTicket",
        ])
      );
    } else {
      Message.error("已選座位數與票數不符");
      return;
    }
  }

  // 在點擊按鈕後更新座位的類型並更換圖片
  const handleClick = (id: number) => {
    setSeatArr((prevSeatArr) => {
      return prevSeatArr.map((seat) => {
        if (seat.id === id && seat.type === "sear_n") {
          if (passengerTicketTotal < tempSelectSeats + 1) {
            Message.error("訂位數超過票數");
            return { ...seat };
          }
          tempSelectSeatsRef.current.push(seat);
          // 增加座位数
          setTempSelectSeats((state) => state + 1);
          // 更新座位類型為 "seat_s"
          return { ...seat, type: "seat_s" };
        }
        if (seat.id === id && seat.type === "seat_s") {
          // 如果是已選擇的座位，則從 tempSelectSeats 移除該座位
          tempSelectSeatsRef.current = tempSelectSeatsRef.current.filter(
            (selectedSeat: SeatDataType) => selectedSeat.id !== id
          );
          setTempSelectSeats((state) => state - 1); // 增加座位数
          return { ...seat, type: "sear_n" }; // 更新座位類型為 "seat_s"
        }
        return seat; // 如果不是目標座位，保持原樣
      });
    });
  };

  return (
    <>
      {isSetSeats && (
        <>
          <Mask></Mask>
          <div className=" fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-[#fff] md:left-auto md:w-[368px]">
            <div className="h-[100vh] w-[298px] md:w-full overflow-hidden flex flex-col">
              {/* 開關按鈕 */}
              <div className="flex-shrink-0 z-50 bg-[#fff] flex justify-between items-center text-[16px] shadow-md w-full px-[16px] py-[12px] ">
                <p>手動劃位</p>
                <button
                  onClick={() =>
                    setIsSetSeats((prevState) => ({
                      ...prevState,
                      isOpen: !prevState.isOpen,
                    }))
                  }
                  className="icon-[ri--close-fill] cursor-pointer h-[16px] w-[16px]"
                ></button>
              </div>
              {/* {seatMessage && (
                <Alert
                  type="error"
                  content="尚未選擇完座位"
                  className={`text-center`}
                />
              )} */}
              <div className="flex-grow overflow-auto">
                {/* 座位狀態圖示 */}
                <div
                  className={`flex justify-center gap-[16px] pt-[20px] pb-[16px]`}
                >
                  <div className={`flex items-center gap-[4px]`}>
                    <span
                      className={`bg-[#CFD6E4] w-[16px] h-[16px] border-[2px] border-solid border-[#1C3E7C]`}
                    ></span>
                    <p>可選擇</p>
                  </div>
                  <div className={`flex items-center gap-[4px]`}>
                    <span
                      className={`bg-[#86D4D9] w-[16px] h-[16px] border-[2px] border-solid border-[#04676C]`}
                    ></span>
                    <p>已選擇</p>
                  </div>
                  <div className={`flex items-center gap-[4px]`}>
                    <span
                      className={`bg-[#C4C4C4] w-[16px] h-[16px] border-[2px] border-solid border-[#3B3B3B]`}
                    ></span>
                    <p>不可選擇</p>
                  </div>
                </div>
                {/* 公車座位圖內容 */}
                <div className="relative w-[298px] h-[666px] md:m-[0_auto]">
                  <img src={SeatsBg} alt="背景圖" className={``} />
                  {seatArr.map((seat, index) => (
                    <button
                      style={{
                        position: "absolute",
                        top: `${Math.floor(index / 5) * 60 + 60}px`, // 每5个座位换行，每行间距60px
                        left: `${16 + (index % 5) * 54}px`, // 每行第一个座位left值为16px，每个座位水平间距4px
                      }}
                      key={seat.id}
                      onClick={() => handleClick(seat.id)} // 在點擊時調用 handleClick 函數
                    >
                      <img
                        src={setSeatImg(seat.type)}
                        alt="未選擇"
                        className={`relative ${
                          seat.type === "null" && "hidden"
                        }`}
                      />
                      <p
                        className={` absolute text-[16px] text-[#1C3E7C] font-bold top-0 left-0 right-0 bottom-0 flex justify-center items-center `}
                      >
                        {seat.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              {/* 下方已選擇座位 & 按鈕 */}
              <div className="flex-shrink-0 z-[50] bg-[#fff] flex justify-between items-center text-[14px] shadow-xl w-full p-[16px] ">
                <p>
                  已選擇({passengerTicketTotal}/{tempSelectSeats})個座位
                </p>
                <div className={`flex gap-[8px]`}>
                  <button
                    onClick={() =>
                      setIsSetSeats((prevState) => ({
                        ...prevState,
                        isOpen: !prevState.isOpen,
                      }))
                    }
                    className={`bg-[#F2F3F5] py-[5px] px-[16px] rounded-[2px]`}
                  >
                    取消
                  </button>
                  <button
                    onClick={submitSetSeat}
                    className={`bg-[#3A57E8] py-[5px] px-[16px] rounded-[2px] text-[#fff]`}
                  >
                    確認
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SetSeat;
