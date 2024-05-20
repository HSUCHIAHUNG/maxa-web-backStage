// 原生方法
import React, { useState } from "react";
// router
import { NavLink } from "react-router-dom";
// ui kit
import { Input } from "@arco-design/web-react";
// Icon
import headerText from "@/assets/images/header/header_text.svg";
import memberIcon from "@/assets/images/header/memberAvatar.svg";
// ui ki( 搜尋框 )
const InputSearch = Input.Search;

const Header: React.FC = () => {
  const [memberList, setMemberList] = useState(false);

  /** @func 搜尋商品 */
  const searchProduct = (value: string) => {
    console.log(value);
    // navigate("order");
  };

  return (
    <>
      <section className="relative bg-[#fff] border-b border-solid border-[#E4E6EF] shadow-inset-top w-[100%] h-[56px] py-[14px] px-[12px] md:pl-[20px] md:pr-[32px] flex justify-between items-center ">
        {/* 左邊maxa logo */}
        <div className={`flex gap-[4px] items-center`}>
          {/* logo回首頁 */}
          <NavLink to={"/order"} className={`flex items-center`}>
            <span className="icon-[solar--box-minimalistic-bold-duotone] w-[24px] h-[24px] text-[#4E5969]"></span>
            <img src={headerText} alt="MAXA" className="w-[66px] h-[14px]" />
          </NavLink>
          {/* 電腦版搜尋行程 */}
          <InputSearch
            onSearch={searchProduct}
            className={` w-[265px] h-[32px] hidden md:block `}
            placeholder="搜尋行程"
            // loading
          />
        </div>
        {/* 會員icon */}
        <button onClick={() => setMemberList((state) => !state)}>
          <img src={memberIcon} alt="會員" />
        </button>
      </section>

      {/* 手機版會員選單 */}
      <div
        className={`absolute w-[124px] rounded-[8px] gap-[7px] z-[999] bg-[#fff] px-[12px] md:top-[60px] md:right-[20px] ${memberList ? 'block' : 'hidden'} `}
      >
        <button
          className={`flex py-[7px] gap-[8px] group hover:text-[#3A57E8] `}
        >
          <span className="icon-[solar--lock-password-bold-duotone] w-[16px] h-[16px] text-[#485781] group-hover:text-[#3A57E8] "></span>
          <p>更改密碼</p>
        </button>
        <button
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
