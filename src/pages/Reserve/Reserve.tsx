// 原生方法
import React, { useEffect, useState } from "react";
// redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../stores/index";

import { orderActions } from "../../stores/order";
// router
import { useNavigate } from "react-router-dom";
// json
import ProductList from "../../assets/API/AllProduct.json";

const Reserve: React.FC = () => {
  const dispatch = useAppDispatch();

  // 動態路由
  const navigate = useNavigate();

  // header搜尋產品條件
  const searchProduct = useSelector((state: RootState) => state.order.searchProduct);

  // 產品列表狀態
  const [filterProductList, setFilterProductList] = useState(ProductList);

  // 產品列表篩選
  useEffect(() => {
    const filtered = ProductList.filter((item) => item.name.includes(searchProduct));
    console.log(filtered);
    setFilterProductList(filtered);
  }, [searchProduct]);

  // 初始化訂單詳情狀態
  useEffect(() => {
    dispatch(orderActions.resetBookingData());
    dispatch(orderActions.resetOrderContent());
  }, [dispatch]);

  // 查看產品詳情
  const handleLinkClick = (_productName: string, id: string) => {
    navigate(`/order/${id}`);
  };

  return (
    <div className={` w-[80%] pb-[16px] max-w-[1240px] m-[0_auto]`}>
      <div className={`py-[16px] text-[20px] text-center`}>
        預約/查詢班次座位
      </div>
      <div className={`flex flex-wrap justify-start gap-[20px]`}>
        {filterProductList.map((product) => (
          <div
            key={product.id}
            className={`relative cursor-pointer`}
            onClick={() => handleLinkClick(product.name, product.id)}
          >
            {/* 圖片 */}
            <div className="w-[373px] h-[200px] rounded-[16px] shadow-md overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-[373px] h-[200px]`}
              />
            </div>
            {/* 產品內文 */}
            <div className={`absolute bottom-0 text-[#fff] py-[9px] px-[16px]`}>
              <p className={`text-[20px]`}>{product.name}</p>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reserve;
