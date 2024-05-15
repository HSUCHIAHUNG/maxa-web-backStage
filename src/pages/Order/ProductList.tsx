import React from "react";
import { Link } from "react-router-dom";

const ProductList: React.FC = () => {
  return (
    <div className={` px-[20px] pb-[16px] w-full max-w-[1240px] m-[0_auto] `}>
      <div className={` py-[16px] text-[20px] text-center `}>
        預約/查詢班次座位
      </div>
      <div className={` flex flex-wrap justify-center gap-[20px]`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Link to={"/ProductDetail"} key={item} className={` relative `}>
            {/* 圖片 */}
            <div className=" w-[373px] h-[200px] rounded-[16px] shadow-md overflow-hidden">
              <img
                src="https://images.chinatimes.com/newsphoto/2023-08-02/656/20230802002582.jpg"
                alt=""
                className={`w-[373px] h-[200px]`}
              />
            </div>
            {/* 產品內文 */}
            <div className={`absolute bottom-0 text-[#fff] py-[9px] px-[16px]`}>
              <p className={`text-[20px] `}>503 石門水庫線(假日行駛)</p>
              <p>桃園客運中壢總站 ⇋ 石門水庫(坪林收費站)</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
