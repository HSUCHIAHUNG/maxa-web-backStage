// 原生方法
import React, { useState } from "react";
// redux
import { orderActions } from "../../stores/order";
import { useAppDispatch } from "../../stores/index";
// router
import { useNavigate } from "react-router-dom";
// ui kit
import { Modal, Radio } from "@arco-design/web-react";
// 匯入圖片
import cashImg from "../../assets/images/order/cash.png";
import creditCardImg from "../../assets/images/order/creditCard.png";
import paymentImg from "../../assets/images/order/payment.png";

const SelectPayment: React.FC = () => {
  // 彈窗狀態開關狀態
  const [visible, setVisible] = useState(true);

  // radio選擇項目
  const [selectedOption, setSelectedOption] = useState("");

  // router動態路由
  const navigate = useNavigate();

  // redux(方法調用)
  const dispatch = useAppDispatch();

  // 選項內容
  const options = [
    { label: "cash", value: "現金" },
    { label: "creditCard", value: "信用卡" },
    { label: "payment", value: "電子支付" },
  ];

  // 篩選返回對應項目圖片
  function filterImg(item: string) {
    switch (item) {
      case "cash":
        return <img src={cashImg} alt="現金" />;
      case "creditCard":
        return <img src={creditCardImg} alt="現金" />;
      case "payment":
        return <img src={paymentImg} alt="現金" />;
      default:
        break;
    }
  }

  // 關閉彈窗
  function closeDialog() {
    dispatch(orderActions.switchStage("selectSeats"));
    setVisible(false);
  }

  // 確認付款方式前往下一階段
  function submit() {
    dispatch(orderActions.switchStage("selectSeats"));
    dispatch(
      orderActions.orderContentStateChenge({
        title: "reserve",
        paymentState: "alreadyPaid",
        paymentMethod: selectedOption,
      })
    );
    navigate("/orderContent/AC021352864");
    setVisible(false);
  }

  return (
    <Modal
      title="選擇付款方式"
      visible={visible}
      onOk={() => submit()}
      onCancel={() => closeDialog()}
      focusLock={true}
      className={`w-fit`}
    >
      <div className={`flex gap-[10px]`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={` border border-solid border-[#3A57E8] rounded-[16px] p-[20px] `}
          >
            <Radio
              key={option.label}
              checked={selectedOption === option.value} // Check if this option is selected
              onChange={() => setSelectedOption(option.value)} // Set selected option when changed
            >
              {filterImg(option.label)}
            </Radio>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SelectPayment;
