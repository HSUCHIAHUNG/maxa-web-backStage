// 產品詳情型別
export interface ProductDetailType {
  id: string;
  industry: string;
  name: string;
  banner: {
    id: string;
    url: string;
  }[];
  stations: { id: string; name: string }[];
}
