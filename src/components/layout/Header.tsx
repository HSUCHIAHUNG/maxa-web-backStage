// 原生方法
import React, { useState } from "react";
// router
import { NavLink, useNavigate } from "react-router-dom";
// redux
import { authActions } from "../../stores/auth.ts";
import { orderActions } from "../../stores/order.ts";
import { useAppDispatch } from "../../stores/index.ts";
// ui kit
import { AutoComplete } from "@arco-design/web-react";
// Icon
import headerText from "@/assets/images/header/header_text.svg";
import memberIcon from "@/assets/images/header/memberAvatar.svg";
// json
import allProduct from "../../assets/API/AllProduct.json";

// ui ki( 搜尋框 )
// const InputSearch = Input.Search;

interface Product {
  id: string;
  industry: string;
  name: string;
  imageUrl: string;
  description: string;
}

const Header: React.FC = () => {
  // redux
  const dispatch = useAppDispatch();

  // 動態路由
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [memberList, setMemberList] = useState(false);

  /** @func 搜尋商品 */
  const handleSearch = (inputValue: string) => {
    setInputValue(inputValue);
    setData(
      inputValue
        ? allProduct.filter((item) => item.name.includes(inputValue))
        : []
    );
  };

  // 案enter時搜尋條件
  const handlePressEnter = () => {
    dispatch(orderActions.setSearchProduct(inputValue));
    navigate("/");
  };

  // autoComplet選擇選項時
  const handleSelect = (selectValue: string) => {
    dispatch(orderActions.setSearchProduct(selectValue));
    navigate("/");
  };

  // const searchProduct = (inputValue: string) => {
  //   console.log(inputValue);

  // }

  return (
    <>
      <section className="relative bg-[#fff] border-b border-solid border-[#E4E6EF] shadow-inset-top w-[100%] h-[56px] py-[14px] px-[12px] md:pl-[20px] md:pr-[32px] flex justify-between items-center ">
        {/* 左邊maxa logo */}
        <div className={`flex gap-[4px] items-center`}>
          {/* logo回首頁 */}
          <NavLink to={"/"} className={`flex items-center`}>
            <span className="icon-[solar--box-minimalistic-bold-duotone] w-[24px] h-[24px] text-[#4E5969]"></span>
            <img src={headerText} alt="MAXA" className="w-[66px] h-[14px]" />
          </NavLink>
          {/* 電腦版搜尋行程 */}
          {/* <InputSearch
            onSearch={searchProduct}
            className={` w-[265px] h-[32px] hidden md:block `}
            placeholder="搜尋行程"
            // loading
          /> */}

          <AutoComplete
            placeholder="Search"
            onSearch={handleSearch}
            onSelect={handleSelect}
            onPressEnter={handlePressEnter}
            data={data.map((item) => item.name)}
            allowClear
            style={{ width: 185 }}
          />
        </div>
        {/* 會員icon */}
        <button
          onClick={() => setMemberList((state) => !state)}
          className={` relative flex gap-[8px] justify-center items-center`}
        >
          <img src={memberIcon} alt="會員" />
          <p>屏東客運_Mia Hsu</p>
          <div
            className={`absolute bottom-[-10px] border-b-[2px] border-solid border-[#3A57E8] w-full ${
              memberList ? "block" : "hidden"
            }`}
          ></div>
        </button>
      </section>

      {/* 手機版會員選單 */}
      <div
        className={`absolute w-[124px] rounded-[8px] gap-[7px] z-[999] bg-[#fff] px-[12px] shadow-md md:top-[60px] md:right-[65px] border border-solid border-[#E4E6EF] ${
          memberList ? "block" : "hidden"
        } `}
      >
        {/* <button
          className={`flex py-[7px] gap-[8px] group hover:text-[#3A57E8] `}
        >
          <span className="icon-[solar--lock-password-bold-duotone] w-[16px] h-[16px] text-[#485781] group-hover:text-[#3A57E8] "></span>
          <p>更改密碼</p>
        </button> */}
        <button
          onClick={() => dispatch(authActions.isLogin())}
          className={`flex py-[7px] gap-[8px] group hover:text-[#3A57E8] `}
        >
          <span className="icon-[solar--logout-3-bold-duotone] w-[16px] h-[16px] text-[#485781] group-hover:text-[#3A57E8] "></span>
          <p>登出</p>
        </button>
      </div>
    </>
  );
};

export default Header;
