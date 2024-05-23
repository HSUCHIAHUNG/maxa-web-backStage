import React from "react";
// ui kit
import { DatePicker, Table } from "@arco-design/web-react";

const columns = [
  {
    title: "清分處理日期",
    dataIndex: "clearanceProcessingDate",
    render: (col: string, _item: unknown, index: number) => {
      const obj = {
        children: col,
        props: {} as { rowSpan?: number },
      };

      if (index === 0) {
        obj.props.rowSpan = 3;
      }
      if (index === 1 || index === 2) {
        obj.props.rowSpan = 0;
      }
      if (index === 3) {
        obj.props.rowSpan = 2;
      }
      if (index === 4) {
        obj.props.rowSpan = 0;
      }

      return obj;
    },
  },
  {
    title: "交易代號",
    dataIndex: "transactionCode",
  },
  {
    title: "交易名稱",
    dataIndex: "transactionName",
  },
  {
    title: "應收筆數金額",
    dataIndex: "receivables",
    children: [
      {
        title: "筆數",
        dataIndex: "receivablesQuantity",
        align: 'right' as const
      },
      {
        title: "金額",
        dataIndex: "receivablesAmount",
        align: 'right' as const
      },
    ],
  },
  {
    title: "應付筆數金額",
    dataIndex: "payable",
    children: [
      {
        title: "筆數",
        dataIndex: "payableQuantity",
        align: 'right' as const
      },
      {
        title: "金額",
        dataIndex: "payableAmount",
        align: 'right' as const
      },
    ],
  },
];

const data = [
  {
    key: "1",
    clearanceProcessingDate: "2024-04-21",
    transactionCode: "810799",
    transactionName: "一般信用卡交易",
    receivables: "32 Park Road, London",
    receivablesQuantity: "1000",
    receivablesAmount: "400001",
    payableQuantity: '0',
    payableAmount: '0',
  },
  {
    key: "2",
    transactionCode: "810799",
    transactionName: "LinePay",
    receivables: "35 Park Road, London",
    receivablesQuantity: "500",
    receivablesAmount: "92000",
    payableQuantity: '0',
    payableAmount: '0',
  },
  {
    key: "3",
    transactionCode: "810799",
    transactionName: "一般信用卡交易退款",
    receivables: "31 Park Road, London",
    receivablesQuantity: "0",
    receivablesAmount: "0",
    payableQuantity: '2',
    payableAmount: '802',
  },
  {
    key: "4",
    transactionCode: "810799",
    clearanceProcessingDate: "2024-04-22",
    transactionName: "一般信用卡交易",
    receivables: "42 Park Road, London",
    receivablesQuantity: "3",
    receivablesAmount: "100",
    payableQuantity: '0',
    payableAmount: '0',
  },
  {
    key: "5",
    transactionCode: "810799",
    transactionName: "一般信用卡交易",
    receivables: "62 Park Road, London",
    receivablesQuantity: "3",
    receivablesAmount: "100",
    payableQuantity: '0',
    payableAmount: '0',
  },
];

const CheckoutReport: React.FC = () => {
  // 計算總計
  const totalReceivablesQuantity = data.reduce((sum, item) => sum + parseFloat(item.receivablesQuantity.replace(/,/g, '')) || 0, 0);
  const totalReceivablesAmount = data.reduce((sum, item) => sum + parseFloat(item.receivablesAmount.replace(/,/g, '')) || 0, 0);
  const totalPayableQuantity = data.reduce((sum, item) => sum + parseFloat(item.payableQuantity.replace(/,/g, '')) || 0, 0);
  const totalPayableAmount = data.reduce((sum, item) => sum + parseFloat(item.payableAmount.replace(/,/g, '')) || 0, 0);
  const totalNetAmount = totalReceivablesAmount - totalPayableAmount;

  return (
    <div className={` w-[80%] py-[16px] m-[0_auto] flex flex-col `}>
      {/* 標題、篩選 */}
      <div className={`flex justify-between items-center w-full pb-[16px]`}>
        <p className={`text-[20px] text-[#1D2129]`}>每日結帳報表</p>
        <div className={`flex gap-[8px]`}>
          {/* 清算日期選擇 */}
          <div className={`w-fit h-[32px]`}>
            <div className={`flex items-center`}>
              <div
                className={`bg-[#F2F3F5] w-[80px] leading-[32px] border-r border-solid border-[#E4E6EF] text-center rounded-[2px_0]`}
              >
                清算日期
              </div>
              <DatePicker placeholder={`請選擇日期`} />
            </div>
          </div>

          {/* 匯出 */}
          <button
            className={`bg-[#3A57E8] rounded-[2px] px-[16px] py-[5px] text-[#fff]`}
          >
            匯出
          </button>
        </div>
      </div>

      {/* table */}
      <Table
        scroll={{
          x: 1200,
        }}
        border={{
          wrapper: true,
          cell: true,
        }}
        columns={columns}
        data={data}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}>總計</Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">{totalReceivablesQuantity}</Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">{totalReceivablesAmount.toLocaleString()}</Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">{totalPayableQuantity}</Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">{totalPayableAmount.toLocaleString()}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>淨額</Table.Summary.Cell>
              <Table.Summary.Cell className={`text-right ${totalNetAmount >= 0 ? '!bg-[#E8FFEA] text-[#00B42A]' : '!bg-[#FFEAE8] text-[#EC4A58] '}`} >
                {totalNetAmount.toLocaleString()}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </div>
  );
};

export default CheckoutReport;
