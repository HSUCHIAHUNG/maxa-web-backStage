// 原生方法
import React from "react";
// redux
import { useDispatch } from "react-redux";
import { orderActions } from "../../stores/order";
// router
import { useNavigate } from "react-router-dom";


// 產品列表資料
const products = [
  {
    id: 1,
    name: "503 石門水庫線(假日行駛)",
    imageUrl:
      "https://images.chinatimes.com/newsphoto/2023-08-02/656/20230802002582.jpg",
    description: "桃園客運中壢總站 ⇋ 石門水庫(坪林收費站)",
  },
  {
    id: 2,
    name: "1801 基隆－石牌－臺北護理健康大學",
    imageUrl:
      "https://res.cloudinary.com/ddkv8pwr5/image/fetch/w_600,h_400,c_fill,q_auto,f_auto/https://tour.klcg.gov.tw/media/klcgtour/attractions/5821017/55f1314c-bc36-4691-aff6-abe5408e424d.jpg",
    description: "基隆－石牌－臺北護理健康大學",
  },
  {
    id: 3,
    name: "1804 基隆－新竹",
    imageUrl: "https://yeh0410.com/wp-content/uploads/2021/10/EC62FBD2-5B60-4BF2-997B-40FB9C992359-7987-000005D8DC35D79B.jpg",
    description: "基隆－新竹",
  },
  {
    id: 4,
    name: "1805 基隆－臺中",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjOd5MuI37ITcftfoj4QWXAbJKUXqdqQUcLwQ3xfVSGg&s",
    description: "基隆－臺中",
  },
  {
    id: 5,
    name: "1806 	基隆－南投",
    imageUrl: "https://www.agoda.com/wp-content/uploads/2020/09/Sun-Moon-Lake-things-to-do-in-Nantou-Taiwan.jpg",
    description: "基隆－南投",
  },
  {
    id: 6,
    name: "1813 臺北－基隆",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqjpSZw4dCDWlL_rL8LZuCWEyHd1ZePwdxoBR3gL4gAA&s",
    description: "臺北－基隆",
  },
  {
    id: 7,
    name: "1813D 臺北－基隆(經中山區)",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7dY2AILeoLfSspYAxhlY41k3VRLDCVCjW9UThU4nBtA&s",
    description: "臺北－基隆(經中山區)",
  },
  {
    id: 8,
    name: "1814	臺北－安樂社區－基隆",
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/62/e9/2b/101.jpg?w=400&h=300&s=1',
    description: "臺北－安樂社區－基隆",
  },
  {
    id: 9,
    name: "1815 臺北－金山青年活動中心	",
    imageUrl: 'https://today-obs.line-scdn.net/0hVVZ03FDBCXlnSSE9anV2Ll0fChZUJRp6A39YeiQnV00eekwuWigVTEtJUkAde04nDi9BGkNMEkgZfRksXSsV/w644',
    description: "臺北－金山青年活動中心	",
  },
];

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLinkClick = (productName: string, id: number) => {
    dispatch(orderActions.selectProduct({ route: productName }));
    navigate(`/order/AC05110522${id}`);
  };

  return (
    <div className={` px-[20px] pb-[16px] w-full max-w-[1240px] m-[0_auto]`}>
      <div className={`py-[16px] text-[20px] text-center`}>
        預約/查詢班次座位
      </div>
      <div className={`flex flex-wrap justify-start gap-[20px]`}>
        {products.map((product) => (
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

export default ProductList;
