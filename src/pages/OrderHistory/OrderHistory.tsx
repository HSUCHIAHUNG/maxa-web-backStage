import React from "react";
// ui kit
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  Select,
  Table,
} from "@arco-design/web-react";
// 時間控制相關
import dayjs from "dayjs";

// ui kit
const InputSearch = Input.Search;
const Option = Select.Option;

// table資料內容
type OrderRecord = {
  key: string;
  number: string;
  state: string;
  route: string;
  industry: string;
  amount: string;
  date: string;
};

const OrderHistory: React.FC = () => {
  // 篩選Modal開關狀態
  const [visible, setVisible] = React.useState(false);

  // table columns
  const columns = [
    {
      title: "訂單編號",
      dataIndex: "number",
      fixed: "left" as const,
      width: "150px",
    },
    {
      title: "訂單狀態",
      dataIndex: "state",
      render: (_col: unknown, record: OrderRecord) => (
        <p className={`${orderStateStyle(record.state)} w-max `}>
          {record.state}
        </p>
      ),
    },
    {
      title: "路線(商品)",
      dataIndex: "route",
    },
    {
      title: "業者",
      dataIndex: "industry",
    },
    {
      title: "訂單金額",
      dataIndex: "amount",
    },
    {
      title: "訂購時間",
      dataIndex: "date",
    },
    {
      title: "操作",
      dataIndex: "操作",
      render: () => <Button>訂單詳情</Button>,
      fixed: "right" as const,
    },
  ];

  // table row
  const row = [
    {
      key: `1`,
      number: `64885813121121`,
      state: "待付款",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
    {
      key: `2`,
      number: `64885813121121`,
      state: "已付款，等待使用",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
    {
      key: `3`,
      number: `64885813121121`,
      state: "申請退款中",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
    {
      key: `4`,
      number: `64885813121121`,
      state: "已完成活動",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
    {
      key: `5`,
      number: `64885813121121`,
      state: "付款期限已截止",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
    {
      key: `6`,
      number: `64885813121121`,
      state: "逾期未使用",
      route: ` 503 石門水庫線(假日行駛)`,
      industry: `屏東客運`,
      amount: `NT$ 1,100`,
      date: `2024-04-21 12:12:12`,
    },
  ];

  // 商品分組
  const groups = [
    ["Black tea latte", "Green tea latte"],
    ["Vanilla Frappuccino", "Matcha Frappuccino"],
    ["Chocolate milk", "Banana milk"],
  ];

  // 訂單狀態篩選資料
  const options = [
    "Beijing",
    "Shanghai",
    "Guangzhou",
    "Shenzhen",
    "Chengdu",
    "Wuhan",
  ];

  // 訂單狀態(欄位樣式)
  const orderStateStyle = (itemName: string) => {
    switch (itemName) {
      case "待付款":
        return "text-[#EC4A58] bg-[#FFEAE8] px-[8px] py-[2px]";
      case "已付款，等待使用":
        return "text-[#3A57E8] bg-[#E8F0FF] px-[8px] py-[2px]";
      case "申請退款中":
        return "text-[#F77234] bg-[#FFF3E8] px-[8px] py-[2px]";
      case "已完成活動":
        return "text-[#0FC6C2] bg-[#E8FFFB] px-[8px] py-[2px]";
      default:
        return "text-[#808EB0] bg-[#F2F3F5] px-[8px] py-[2px]";
    }
  };

  return (
    <>
      <div className={`w-[80%] px-[20px] py-[16px] m-[0_auto] `}>
        {/* 標題、篩選 */}
        <div className={`flex justify-between items-center w-full pb-[16px]`}>
          <p className={`text-[20px] text-[#1D2129]`}>訂單記錄</p>
          <div className={`flex gap-[8px]`}>
            {/* 訂單編號篩選 */}
            <InputSearch
              allowClear
              placeholder="搜尋訂單編號"
              style={{ width: 220 }}
            />

            {/* 日期篩選 */}
            <DatePicker.RangePicker
              placeholder={["開始日期", "結束日期"]}
              style={{ width: 240 }}
              disabledDate={(current) => current.isAfter(dayjs())}
              shortcutsPlacementLeft
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
          data={row}
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
              mode="multiple"
              placeholder="所有狀態"
              defaultValue={["Beijing", "Shenzhen"]}
              allowClear
            >
              {options.map((option) => (
                <Option key={option} value={option} className={``}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          {/* 業者 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>業者</p>
            <Select placeholder="Please select">
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          {/* 商品 */}
          <div className={``}>
            <p className={`text-[#4E5969] pb-[9px]`}>商品</p>
            <Select showSearch allowClear placeholder="Select drink">
              {groups.map((options, index) => {
                return (
                  <Select.OptGroup label={`Group-${index}`} key={index}>
                    {options.map((option) => (
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
