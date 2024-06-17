import React, { useEffect, useState } from "react";
// router
import { useNavigate } from "react-router-dom";
// redux
import { orderActions } from "../../stores/order";
import { useAppDispatch } from "../../stores/index";
// ui kit
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
} from "@arco-design/web-react";
// 時間控制相關
import dayjs, { Dayjs } from "dayjs";
// 匯入型別
import { OrderRecord } from "./type";
// 匯入樣式
import "../../assets/css/OrderHistory.css";
// 匯入json
import OrderHistoryList from "../../assets/API/OrderHistory.json";
// 匯入圖片
import defaultImg from "../../assets/images/orderHistory/defaultImg.png";
import guestImg from "../../assets/images/orderHistory/guestImg.png";
import serviceImg from "../../assets/images/orderHistory/serviceImg.png";
import emptyImg from "../../assets/images/empty-state.png";
// SheetJS
import * as XLSX from "xlsx";
// ui kit
const InputSearch = Input.Search;
const Option = Select.Option;

const OrderHistory: React.FC = () => {
  // redux(方法調用)
  const dispatch = useAppDispatch();

  // 動態路由
  const navigate = useNavigate();

  // 初始化訂單詳情狀態
  useEffect(() => {
    dispatch(orderActions.resetBookingData());
    dispatch(orderActions.resetOrderContent());
  }, [dispatch]);

  // 篩選Modal開關狀態
  const [visible, setVisible] = useState(false);

  // 篩選條件狀態
  const [orderHistoryFilters, setOrderHistoryFilters] = useState<{
    orderNumber: string;
    customer: string;
    provider: string;
    routeProduct: string;
    orderTime: [Dayjs | null, Dayjs | null];
    orderStatus: string[];
  }>({
    orderNumber: "",
    customer: "",
    provider: "",
    routeProduct: "",
    orderTime: [null, null],
    orderStatus: [],
  });

  // 暫存篩選條件
  const [tempOrderHistoryFilters, setTempOrderHistoryFilters] = useState({
    orderNumber: "",
    customer: "",
    provider: "",
    routeProduct: "",
    orderTime: [null, null] as [Dayjs | null, Dayjs | null],
    orderStatus: [] as string[],
  });

  // 購買方式狀態
  const [purchaseType, setPurchaseType] = useState("online"); // 'online' or 'onsite'

  // pagination
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // table columns
  const columns = [
    {
      title: "訂單編號",
      dataIndex: "orderNumber",
      ellipsis: true,
      width: "60px",
      fixed: "left" as const,
    },
    ...(purchaseType === "online"
      ? []
      : [
          {
            title: "訂購人",
            dataIndex: "customer",
            width: "50px",
            render: (_col: unknown, record: OrderRecord) => (
              <div className={`flex justify-start items-center gap-[8px]`}>
                {customerImg(record.customer)}
                <p>{record.customer}</p>
              </div>
            ),
          },
        ]),
    {
      title: "路線(商品)",
      dataIndex: "routeProduct",
      ellipsis: true,
      width: "70px",
    },
    {
      title: "業者",
      dataIndex: "provider",
      ellipsis: true,
      width: "38px",
    },
    {
      title: "訂單金額",
      dataIndex: "orderAmount",
      ellipsis: true,
      width: "35px",
    },
    {
      title: "訂購時間",
      dataIndex: "orderTime",
      ellipsis: true,
      width: "60px",
    },
    {
      title: "訂單狀態",
      dataIndex: "orderStatus",
      ellipsis: true,
      width: "60px",
      render: (_col: unknown, record: OrderRecord) => (
        <div className={`flex justify-start items-center gap-[8px]`}>
          <div
            className={`${tableOrderStateStyle(record.orderStatus)} w-[6px]`}
          ></div>
          <p className={` `}>{record.orderStatus}</p>
        </div>
      ),
    },
    {
      title: "操作",
      dataIndex: "操作",
      ellipsis: true,
      width: "18px",
      render: (_col: unknown, record: OrderRecord) => (
        <Button
          onClick={() => orderDetail(record)}
          className={` flex justify-center items-center bg-[#F2F3F5] rounded-[2px] p-0 `}
        >
          <span
            className={`icon-[fluent--clipboard-bullet-list-16-filled] w-[16px] h-[16px] m-[9px] text-[#4E5969] `}
          ></span>
        </Button>
      ),
      fixed: "right" as const,
    },
  ];

  // 商品分組
  const productGroups = [
    { title: "台北", groups: ["台北 ⮕ 彰化/員林/北斗"] },
    {
      title: "桃園",
      groups: [
        "501 大溪快線",
        "502 小烏來線(假日行駛)",
        "503 石門水庫線(假日行駛)",
        "506 東眼山線",
        "503 石門水庫線(假日行駛)",
      ],
    },
  ];

  // 訂單狀態篩選資料
  const orderStateOption = [
    "待付款",
    "已付款",
    "申請退款中",
    "付款期限已截止 ",
    "已退款",
    "訂單已取消(會員)",
    "訂單已取消(系統)",
  ];

  // 業者篩選資料
  const industryOptions = ["桃園客運", "國光客運", "屏東客運"];

  // 訂單狀態(欄位樣式)
  const tableOrderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return " bg-[#EC4A58] w-[6px] h-[6px] rounded-[100px]";
      case "已付款":
        return "bg-[#3A57E8] w-[6px] h-[6px] rounded-[100px]";
      case "申請退款中":
        return "bg-[#FF7D00] w-[6px] h-[6px] rounded-[100px]";
      case "已完成活動":
        return "bg-[#0FC6C2] w-[6px] h-[6px] rounded-[100px]";
      default:
        return "bg-[#E4E6EF] w-[6px] h-[6px] rounded-[100px]";
    }
  };

  // 訂單狀態(篩選欄位樣式)
  const filterOrderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return "text-[#EC4A58] bg-[#FFEAE8] px-[8px] py-[2px] text-[14px]";
      case "已付款":
        return "text-[#3A57E8] bg-[#E8F0FF] px-[8px] py-[2px] text-[14px]";
      case "申請退款中":
        return "text-[#FF7D00] bg-[#FFF3E8] px-[8px] py-[2px] text-[14px]";
      case "已完成活動":
        return "text-[#0FC6C2] bg-[#E8FFFB] px-[8px] py-[2px] text-[14px]";
      default:
        return "text-[#808EB0] bg-[#F2F3F5] px-[8px] py-[2px]";
    }
  };

  const customerImg = (customer: string) => {
    switch (customer) {
      case "現場購買":
        return <img src={serviceImg} alt="現場購買" />;
      case "無登入購買":
        return <img src={guestImg} alt="無登入購買" />;
      default:
        return <img src={defaultImg} alt="預設圖" />;
    }
  };

  // 訂單狀態(欄位樣式)
  const paymentState = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return "pendingPayment";
      case "已付款":
        return "alreadyPaid";
      case "申請退款中":
        return "refund";
      case "已完成活動":
        return "activeComplate";
      default:
        return itemName;
    }
  };

  // 篩選訂單狀態(動態顯示tag樣式)
  function tagRender(props: {
    label: React.ReactNode;
    value: string;
    closable: boolean;
    onClose: ((e: unknown) => void | Promise<unknown>) | undefined;
  }) {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        className={filterOrderStateStyle(value)}
      >
        {label}
      </Tag>
    );
  }

  // DatePicker清空時的處理函數
  const handleDatePickerClear = () => {
    // 清空日期篩選條件
    handleImmediateFilterChange("orderTime", [null, null]);
  };

  // 即時篩選變更處理函數
  const handleImmediateFilterChange = (key: string, value: unknown) => {
    setOrderHistoryFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrent(1); // 重置頁碼
  };

  // 暫存篩選變更處理函數
  const handleTempFilterChange = (key: string, value: unknown) => {
    setTempOrderHistoryFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrent(1); // 重置頁碼
  };

  // 篩選條件時重置頁碼
  const applyFilters = () => {
    setOrderHistoryFilters((prevFilters) => ({
      ...prevFilters,
      ...tempOrderHistoryFilters,
    }));
    setCurrent(1); // 重置頁碼
    setVisible(false);
  };

  // 根據篩選條件篩選數據
  const filteredData = OrderHistoryList.filter((item) => {
    const {
      orderNumber,
      customer,
      provider,
      routeProduct,
      orderStatus,
      orderTime,
    } = orderHistoryFilters;
    const [startDate, endDate] = orderTime;

    return (
      (!orderNumber || item.orderNumber.includes(orderNumber)) &&
      (!customer || item.customer.includes(customer)) &&
      (!provider || item.provider.includes(provider)) &&
      (!routeProduct || item.routeProduct.includes(routeProduct)) &&
      (!orderStatus.length || orderStatus.includes(item.orderStatus)) &&
      (!startDate ||
        !endDate ||
        (dayjs(item.orderTime).isAfter(startDate) &&
          dayjs(item.orderTime).isBefore(endDate))) &&
      (purchaseType === "online"
        ? item.customer !== "現場購買"
        : item.customer === "現場購買")
    );
  }).map((item) => ({
    ...item,
    key: item.orderNumber, // 添加唯一的 key 屬性
  }));

  // 訂單詳情
  const orderDetail = (record: OrderRecord) => {
    console.log(record);
    // 將票價跟備註存進redux
    dispatch(
      orderActions.orderContentStateChenge({
        title: "orderHistory",
        paymentState: paymentState(record.orderStatus),
        totalAmount: record.orderAmount,
        industryName: record.provider,
        routeName: record.routeProduct,
      })
    );
    navigate(`/orderContent/${record.orderNumber}`);
  };

  const clearFilters = () => {
    setTempOrderHistoryFilters({
      orderNumber: "",
      customer: "",
      provider: "",
      routeProduct: "",
      orderTime: [null, null],
      orderStatus: [],
    });
  };

  // table轉excel
  const exportToExcel = () => {
    const worksheetData = paginatedData.map((row) => ({
      訂單編號: row.orderNumber,
      訂購人: row.customer,
      "路線(商品)": row.routeProduct,
      業者: row.provider,
      訂單金額: row.orderAmount,
      訂購時間: row.orderTime,
      訂單狀態: row.orderStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "訂單紀錄.xlsx");
  };

  // 分頁後的數據
  const paginatedData = filteredData.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <>
      <div className={`orderHistory w-[80%] py-[16px] m-[0_auto] `}>
        {/* 標題、篩選 */}
        <div className={`flex justify-between items-center w-full pb-[16px]`}>
          <div className={`flex gap-[8px]`}>
            <p className={`text-[20px] text-[#1D2129]`}>訂單記錄</p>

            {/* 線上購買、現場購買狀態切換 */}
            <div className={`text-[#485781] flex items-center gap-[8px]`}>
              <button
                onClick={() => setPurchaseType("online")}
                className={purchaseType === "online" ? "text-[#3A57E8]" : ""}
              >
                線上購買
              </button>
              <div
                className={` h-[12px] border-r-[2px] border-solid border-[#E4E6EF]`}
              ></div>
              <button
                onClick={() => setPurchaseType("onsite")}
                className={purchaseType === "onsite" ? "text-[#3A57E8]" : ""}
              >
                現場購買
              </button>
            </div>
          </div>

          <div className={`flex gap-[8px]`}>
            {/* 訂單編號篩選 */}
            <InputSearch
              allowClear
              placeholder="搜尋訂單編號"
              style={{ width: 220 }}
              onSearch={(value) =>
                handleImmediateFilterChange("orderNumber", value)
              }
            />

            {/* 日期篩選 */}
            <DatePicker.RangePicker
              placeholder={["開始日期", "結束日期"]}
              style={{ width: 240 }}
              disabledDate={(current) => current.isAfter(dayjs())}
              shortcutsPlacementLeft
              onChange={(dates) =>
                handleImmediateFilterChange("orderTime", dates)
              }
              shortcuts={[
                {
                  text: "近1週",
                  value: () => [dayjs(), dayjs().subtract(1, "week")],
                },
                {
                  text: "近1個月",
                  value: () => [dayjs(), dayjs().subtract(1, "month")],
                },
                {
                  text: "近3個月",
                  value: () => [dayjs(), dayjs().subtract(3, "month")],
                },
                {
                  text: "近6個月",
                  value: () => [dayjs(), dayjs().subtract(6, "month")],
                },
              ]}
              // 添加onClear屬性
              onClear={handleDatePickerClear}
            />

            {/* 開啟隱藏選單按鈕-訂單狀態、業者、商品篩選按鈕 */}
            <Button
              onClick={() => {
                setVisible(true);
              }}
              type="primary"
              className={` px-[16px] flex justify-center items-center !bg-[#F2F3F5] !text-[#4E5969] hover:!bg-[#E8F0FF] hover:!text-[#3A57E8]`}
            >
              <span
                className={`mr-[8px] icon-[solar--filter-bold-duotone] w-[16px] h-[16px]`}
              ></span>
              <p className={``}>篩選</p>
            </Button>

            {/* 匯出 */}
            <button
              onClick={exportToExcel}
              className={`bg-[#3A57E8] rounded-[2px] px-[16px] py-[5px] text-[#fff]`}
            >
              匯出
            </button>
          </div>
        </div>

        {/* 表格內容 */}
        <Table
          columns={columns}
          data={paginatedData}
          pagination={false}
          noDataElement={
            <div
              className={`flex flex-col justify-center items-center gap-[20px] h-full`}
            >
              <img
                src={emptyImg}
                alt="查無資料"
                className={`w-[200px] h-[200px]`}
              />
              <p className={`text-[16px]`}>搜尋不到結果</p>
            </div>
          }
          scroll={{
            y: 500,
            x: 1000,
          }}
        />

        <Pagination
          current={current}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={(page) => setCurrent(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrent(1);
          }}
          showTotal={(total) => `共${total}筆`}
          className="flex justify-end mt-4"
        />
      </div>

      {/* 隱藏選單-訂單狀態、業者、商品篩選 */}

      <Drawer
        width={400}
        title={<span className={`text-[16px]`}>篩選</span>}
        visible={visible}
        onOk={applyFilters}
        onCancel={() => {
          setVisible(false);
        }}
        footer={
          <Space>
            <Button onClick={clearFilters}>還原預設值</Button>
            <Button type="primary" onClick={applyFilters}>
              確定
            </Button>
          </Space>
        }
      >
        <div
          className={`flex flex-col gap-[20px] px-[16px] py-[12px] w-[345px]`}
        >
          {/* 訂單狀態 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>訂單狀態</p>
            <Select
              onChange={(value) => handleTempFilterChange("orderStatus", value)}
              value={tempOrderHistoryFilters.orderStatus} // 綁定值
              mode="multiple"
              placeholder="所有狀態"
              allowClear
              renderTag={tagRender}
            >
              {orderStateOption.map((option) => (
                <Option key={option} value={option} className={``}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          {/* 業者 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>業者</p>
            <Select
              onChange={(value) => handleTempFilterChange("provider", value)}
              value={tempOrderHistoryFilters.provider || undefined} // 綁定值
              placeholder="所有業者"
              allowClear
            >
              {industryOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          {/* 商品 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>商品</p>
            <Select
              onChange={(value) =>
                handleTempFilterChange("routeProduct", value)
              }
              value={tempOrderHistoryFilters.routeProduct || undefined} // 綁定值
              showSearch
              allowClear
              placeholder="所有商品"
            >
              {productGroups.map((options) => {
                return (
                  <Select.OptGroup label={options.title} key={options.title}>
                    {options.groups.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select.OptGroup>
                );
              })}
            </Select>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default OrderHistory;
