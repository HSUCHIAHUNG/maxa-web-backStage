import React, { useRef, useState } from "react";
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
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// 時間控制相關
dayjs.extend(isBetween);

// ui kit
const InputSearch = Input.Search;
const Option = Select.Option;

// table資料內容型別
type OrderRecord = {
  key: string;
  orderNumber: string;
  paymentNumber: string;
  transactionDate: string;
  transactionAmount: string;
  orderState: string;
  transactionName: string;
  clearanceDate?: string;
  liquidationDate?: string;
};

const CheckoutDetails: React.FC = () => {
  // redux(方法調用)
  const dispatch = useAppDispatch();
  // 動態路由
  const navigate = useNavigate();
  // 篩選Modal開關狀態
  const [visible, setVisible] = useState(false);

  // 篩選條件狀態
  const [filters, setFilters] = useState<{
    orderNumber: string;
    orderState: string[];
    paymentNumber: string;
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  }>({
    orderNumber: "",
    orderState: [],
    paymentNumber: "",
    dateRange: [null, null],
  });

  // 暫存篩選條件
  const [tempFilters, setTempFilters] = useState({
    transactionName: [] as string[],
    paymentNumber: "",
  });

  // 搜尋條件
  const searchCriteria = useRef("交易日期");

  // table columns
  const columns = [
    {
      title: "訂單編號",
      dataIndex: "orderNumber",
      fixed: "left" as const,
      width: "150px",
    },
    {
      title: "交易名稱",
      dataIndex: "transactionName",
    },
    {
      title: "支付工具號碼(授權碼)",
      dataIndex: "paymentNumber",
    },
    {
      title: "交易日期時間",
      dataIndex: "transactionDate",
    },
    {
      title: "交易金額",
      dataIndex: "transactionAmount",
    },
    {
      title: "交易狀態",
      dataIndex: "orderState",
      render: (_col: unknown, record: OrderRecord) => (
        <div className={`flex justify-start items-center gap-[8px]`}>
          <div
            className={`${tableOrderStateStyle(record.orderState)} w-max`}
          ></div>
          <p className={` `}>{record.orderState}</p>
        </div>
      ),
    },
    {
      title: "清分日期",
      dataIndex: "clearanceDate",
    },
    {
      title: "清算日期",
      dataIndex: "liquidationDate",
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

  // table row
  const rows: OrderRecord[] = [
    {
      key: `1`,
      orderNumber: `648858131211213`,
      transactionName: "一般信用卡交易",
      paymentNumber: `542898***0123(649788)`,
      transactionDate: `2024-04-21 09:22:20`,
      transactionAmount: `NT$ 1,100`,
      orderState: "已授權",
      clearanceDate: "2024-04-21",
      liquidationDate: "2024-04-23",
    },
    {
      key: `2`,
      orderNumber: `325251701232312`,
      transactionName: "一般信用卡交易",
      paymentNumber: `542898***0123(649788)`,
      transactionDate: `2024-04-22 09:22:20`,
      transactionAmount: `NT$ 1,100`,
      orderState: "已撥款",
      clearanceDate: "2024-04-22",
      liquidationDate: "2024-04-23",
    },
    {
      key: `3`,
      orderNumber: `207664866757545`,
      transactionName: "一般信用卡交易",
      paymentNumber: `542898***0123(649788)`,
      transactionDate: `2024-04-23 09:22:20`,
      transactionAmount: `NT$ 1,100`,
      orderState: "已請款",
      clearanceDate: "2024-04-25",
      liquidationDate: "2024-04-26",
    },
    {
      key: `4`,
      orderNumber: `207664866757545`,
      transactionName: "一般信用卡交易",
      paymentNumber: `542898***0123(649788)`,
      transactionDate: `2024-04-24 09:22:20`,
      transactionAmount: `NT$ 1,100`,
      orderState: "授權失敗",
      clearanceDate: "2024-04-27",
      liquidationDate: "2024-04-28",
    },
  ];

  // 交易狀態篩選資料
  const orderStateOption = ["授權失敗", "已請款", "已撥款", "已授權"];

  // 交易狀態(table欄位樣式)
  const tableOrderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "授權失敗":
        return " bg-[#EC4A58] w-[6px] h-[6px] rounded-[100px]";
      case "已請款":
        return "bg-[#3A57E8] w-[6px] h-[6px] rounded-[100px]";
      case "已撥款":
        return "bg-[#00B42A] w-[6px] h-[6px] rounded-[100px]";
      case "已授權":
        return "bg-[#0FC6C2] w-[6px] h-[6px] rounded-[100px]";
      default:
        return "bg-[#E4E6EF] w-[6px] h-[6px] rounded-[100px]";
    }
  };

  // 交易狀態(篩選欄位樣式)
  const filterOrderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "授權失敗":
        return "text-[#EC4A58] bg-[#FFEAE8] px-[8px] py-[2px] text-[14px]";
      case "已請款":
        return "text-[#3A57E8] bg-[#E8F0FF] px-[8px] py-[2px] text-[14px]";
      case "已撥款":
        return "text-[#00B42A] bg-[#E8FFEA] px-[8px] py-[2px] text-[14px]";
      case "已授權":
        return "text-[#0FC6C2] bg-[#E8FFFB] px-[8px] py-[2px] text-[14px]";
      default:
        return "text-[#808EB0] bg-[#F2F3F5] px-[8px] py-[2px] text-[14px]";
    }
  };

  // 交易狀態(欄位樣式)
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

  // 篩選交易狀態(動態顯示tag樣式)
  function tagRender(props: {
    label: React.ReactNode;
    value: string;
    closable: boolean;
    onClose: ((e: unknown) => void | Promise<unknown>) | undefined;
  }) {
    const { label, value, closable, onClose } = props;
    return (
      <Tag closable={closable} onClose={onClose} className={`${filterOrderStateStyle(value)} `}>
        {label}
      </Tag>
    );
  }

  // 即時篩選變更處理函數
  const handleImmediateFilterChange = (key: string, value: unknown) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 暫存篩選變更處理函數
  const handleTempFilterChange = (key: string, value: unknown) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 根據篩選條件篩選數據
  const filteredData = rows.filter((item) => {
    const { orderNumber, orderState, paymentNumber, dateRange } = filters;
    const startDate = dateRange[0];
    const endDate = dateRange[1];

    let dateField = "";

    if (searchCriteria.current === "交易日期") {
      dateField = item.transactionDate;
    } else if (searchCriteria.current === "清分日期") {
      dateField = item.clearanceDate!;
    } else if (searchCriteria.current === "清算日期") {
      dateField = item.liquidationDate!;
    }

    const dateCondition =
      startDate && endDate
        ? dayjs(dateField).isBetween(startDate, endDate, "day", "[]")
        : true;

    return (
      (!orderNumber || item.orderNumber.includes(orderNumber)) &&
      (!orderState.length || orderState.includes(item.orderState)) &&
      (!paymentNumber || item.paymentNumber.includes(paymentNumber)) &&
      dateCondition
    );
  });

  // 訂單詳情
  const orderDetail = (record: OrderRecord) => {
    console.log(record);
    // 將票價跟備註存進redux
    dispatch(
      orderActions.orderContentStateChenge({
        title: "orderHistory",
        paymentState: paymentState(record.orderState),
        remarks: "",
      })
    );
    navigate("/orderContent/ABC1293822839");
  };

  // 搜尋條件(交易日期、清分日期、清算日期)
  const changeSearchCriteria = (value: string) => {
    searchCriteria.current = value;
  };

  return (
    <>
      <div className={`w-[80%] py-[16px] m-[0_auto] `}>
        {/* 標題、篩選 */}
        <div className={`flex justify-between items-center w-full pb-[16px]`}>
          <p className={`text-[20px] text-[#1D2129]`}>每日結帳明細查詢</p>
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

            {/* Drawer開關按鈕-日期查詢、交易狀態 */}
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

      {/* 日期查詢、交易狀態 */}
      <Drawer
        width={750}
        title={<span className={`text-[16px]`}>篩選</span>}
        visible={visible}
        onOk={() => {
          setFilters((prevFilters) => ({
            ...prevFilters,
            ...tempFilters,
          })); // 當點擊確定按鈕時，將暫存的篩選條件應用到正式的篩選條件
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className={` flex flex-col gap-[20px] `}>
          {/* 日期篩選 */}
          <div className={`w-full`}>
            <p className={`text-[#4E5969] pb-[9px]`}>日期查詢</p>
            <Input.Group compact>
              <Select
                onChange={(value) => changeSearchCriteria(value)}
                showSearch
                defaultValue={searchCriteria.current}
                className={`w-[30%]`}
              >
                <Select.Option value="交易日期">交易日期</Select.Option>
                <Select.Option value="清分日期">清分日期</Select.Option>
                <Select.Option value="清算日期">清算日期</Select.Option>
              </Select>
              {/* 日期篩選 */}
              <DatePicker.RangePicker
                placeholder={["開始日期", "結束日期"]}
                className={`w-[70%]`}

                disabledDate={(current) => current.isAfter(dayjs())}
                shortcutsPlacementLeft
                onChange={(dates) => handleTempFilterChange("dateRange", dates)}
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
            </Input.Group>
          </div>

          {/* 交易狀態 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>交易狀態</p>
            <Select
              onChange={(value) => handleTempFilterChange("orderState", value)}
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
        </div>
      </Drawer>
    </>
  );
};

export default CheckoutDetails;
