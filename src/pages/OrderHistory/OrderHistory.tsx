import React, { useState } from "react";
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
  Select,
  Table,
  Tag,
} from "@arco-design/web-react";
// 時間控制相關
import dayjs, { Dayjs } from "dayjs";
// 匯入型別
import { OrderRecord } from "./type";
// 匯入json
import OrderHistoryList from "../../assets/API/OrderHistory.json";

// ui kit
const InputSearch = Input.Search;
const Option = Select.Option;

const OrderHistory: React.FC = () => {
  // redux(方法調用)
  const dispatch = useAppDispatch();

  // 動態路由
  const navigate = useNavigate();

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

  // table columns
  const columns = [
    {
      title: "訂單編號",
      dataIndex: "orderNumber",
      fixed: "left" as const,
    },
    {
      title: "訂購人",
      dataIndex: "customer",
    },
    {
      title: "路線(商品)",
      dataIndex: "routeProduct",
    },
    {
      title: "業者",
      dataIndex: "provider",
    },
    {
      title: "訂單金額",
      dataIndex: "orderAmount",
    },
    {
      title: "訂購時間",
      dataIndex: "orderTime",
    },
    {
      title: "訂單狀態",
      dataIndex: "orderStatus",
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
    "已付款，等待使用",
    "申請退款中",
    "已完成活動",
    "付款期限已截止 ",
    "逾期未使用",
    "已退款",
    "訂單取消(會員)",
    "訂單取消(系統)",
  ];

  // 業者篩選資料
  const industryOptions = ["桃園客運", "國光客運", "屏東客運"];

  // 訂單狀態(欄位樣式)
  const tableOrderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return " bg-[#EC4A58] w-[6px] h-[6px] rounded-[100px]";
      case "已付款，等待使用":
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
      case "已付款，等待使用":
        return "text-[#3A57E8] bg-[#E8F0FF] px-[8px] py-[2px] text-[14px]";
      case "申請退款中":
        return "text-[#FF7D00] bg-[#FFF3E8] px-[8px] py-[2px] text-[14px]";
      case "已完成活動":
        return "text-[#0FC6C2] bg-[#E8FFFB] px-[8px] py-[2px] text-[14px]";
      default:
        return "text-[#808EB0] bg-[#F2F3F5] px-[8px] py-[2px] text-[14px]";
    }
  };

  // 訂單狀態(欄位樣式)
  const paymentState = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return "pendingPayment";
      case "已付款，等待使用":
        return "alreadyPaid";
      case "申請退款中":
        return "refund";
      case "已完成活動":
        return "activeComplate";
      default:
        return "";
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

  // 即時篩選變更處理函數
  const handleImmediateFilterChange = (key: string, value: unknown) => {
    setOrderHistoryFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 暫存篩選變更處理函數
  const handleTempFilterChange = (key: string, value: unknown) => {
    setTempOrderHistoryFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
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
          dayjs(item.orderTime).isBefore(endDate)))
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
        remarks: "",
        totalAmount: record.orderAmount,
      })
    );
    navigate("/orderContent/ABC1293822839");
  };

  return (
    <>
      <div className={`w-[80%] py-[16px] m-[0_auto] `}>
        {/* 標題、篩選 */}
        <div className={`flex justify-between items-center w-full pb-[16px]`}>
          <p className={`text-[20px] text-[#1D2129]`}>訂單記錄</p>
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
            />

            {/* 訂單狀態、業者、商品篩選按鈕 */}
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
          </div>
        </div>
        {/* 表格內容 */}
        <Table
          columns={columns}
          data={filteredData}
          pagination={false}
          scroll={{
            y: 500,
            x: 1000,
          }}
        />
      </div>

      {/* 訂單狀態、業者、商品篩選 */}
      <Drawer
        width={400}
        title={<span className={`text-[16px]`}>篩選</span>}
        visible={visible}
        onOk={() => {
          setOrderHistoryFilters((prevFilters) => ({
            ...prevFilters,
            ...tempOrderHistoryFilters,
          })); // 當點擊確定按鈕時，將暫存的篩選條件應用到正式的篩選條件
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          className={` flex flex-col gap-[20px] px-[16px] py-[12px] w-[345px]`}
        >
          {/* 訂單狀態 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>訂單狀態</p>
            <Select
              onChange={(value) => handleTempFilterChange("orderStatus", value)}
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
              placeholder="Please select"
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
              showSearch
              allowClear
              placeholder="Select route"
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
