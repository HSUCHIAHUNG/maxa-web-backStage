// 原生方法
import React from "react";
// redux
// import { useDispatch } from "react-redux";
// import { orderActions } from "../../stores/order";
// router
import { useNavigate } from "react-router-dom";
// json
import ProductList from '../../assets/API/AllProduct.json';


const Reserve: React.FC = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLinkClick = (productName: string, id: string) => {
    // dispatch(orderActions.selectProduct({ route: productName }));
    navigate(`/order/${id}`);
  };

  return (
    <div className={` w-[80%] pb-[16px] max-w-[1240px] m-[0_auto]`}>
      <div className={`py-[16px] text-[20px] text-center`}>
        預約/查詢班次座位
      </div>
      <div className={`flex flex-wrap justify-start gap-[20px]`}>
        {ProductList.map((product) => (
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
