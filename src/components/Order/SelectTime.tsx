import React from "react";
import { useSelector } from "react-redux";
import { orderActions } from "../../stores/order";
import { RootState, useAppDispatch } from "../../stores/index";
import {
  Button,
  Divider,
  Form,
  Message,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
interface SelectTimeData {
  id: string;
  startStation: string;
  endStation: string;
  seats: string;
  Vehicles: string;
}

const SelectTime: React.FC = () => {
  const ticketState = useSelector((state: RootState) => state.order.ticket);

  const dispatch = useAppDispatch();

  const bookingStage = useSelector(
    (state: RootState) => state.order.bookingStage
  );

  const bookingData = useSelector(
    (state: RootState) => state.order.bookingData
  );

  const FormItem = Form.Item;
  const [form] = Form.useForm();

  const departureColumns: TableColumnProps[] = [
    {
      title: "班次編號",
      dataIndex: "id",
      fixed: "left",
    },
    {
      title: bookingData?.stationData?.startStation,
      dataIndex: "endStation",
    },
    {
      title: bookingData?.stationData?.endStation,
      dataIndex: "startStation",
    },
    {
      title: "空位數",
      dataIndex: "seats",
    },
    {
      title: "車種",
      dataIndex: "Vehicles",
    },
  ];

  const returnTripColumns: TableColumnProps[] = [
    {
      title: "班次編號",
      dataIndex: "id",
      fixed: "left",
    },
    {
      title: bookingData.stationData.endStation,
      dataIndex: "startStation",
    },
    {
      title: bookingData.stationData.startStation,
      dataIndex: "endStation",
    },
    {
      title: "空位數",
      dataIndex: "seats",
    },
    {
      title: "車種",
      dataIndex: "Vehicles",
    },
  ];

  const data: SelectTimeData[] = [
    {
      id: "001",
      startStation: "09:00",
      endStation: "09:30",
      seats: "5",
      Vehicles: "一般公車",
    },
    {
      id: "002",
      startStation: "09:00",
      endStation: "09:30",
      seats: "5",
      Vehicles: "一般公車",
    },
    {
      id: "003",
      startStation: "09:00",
      endStation: "09:30",
      seats: "5",
      Vehicles: "一般公車",
    },
    {
      id: "004",
      startStation: "09:00",
      endStation: "09:30",
      seats: "5",
      Vehicles: "一般公車",
    },
    {
      id: "005",
      startStation: "09:00",
      endStation: "09:30",
      seats: "5",
      Vehicles: "一般公車",
    },
  ];

  const submit = () => {
    console.log(bookingData);
    if (ticketState === "oneWayTicket" && !bookingData.timeData.startTime) {
      Message.error("請選擇搭車時間");
    } else if (
      ticketState === "roundTripTicket" &&
      (!bookingData.timeData.startTime || !bookingData.timeData.endTime)
    ) {
      Message.error("請選擇搭車時間");
    } else {
      dispatch(orderActions.switchStage("selectSeats"));
    }
  };

  const isOpen = () => (bookingStage !== "selectTime" ? "hidden" : "block");

  const selectSeatIsOpen = () =>
    bookingStage !== "selectSeats" ? "hidden" : "block";

  const setSelectData = (
    _selectedRowKeys: (string | number)[],
    selectedRows: SelectTimeData[],
    selectItem: "startTime" | "endTime"
  ) => {
    selectedRows.forEach((row) => {
      dispatch(orderActions.setTimeData([selectItem, row]));
    });
  };

  return (
    <>
      <div className={`${isOpen()}`}>
        <Form
          form={form}
          autoComplete="on"
          requiredSymbol={{ position: "start" }}
          layout="vertical"
          onSubmit={submit}
          className={`${isOpen()}`}
        >
          <div className={` md:gap-[20px] `}>
            <FormItem label="選擇去程班次" field="startTime" required>
              <Table
                scroll={{ x: 630 }}
                rowKey="id"
                columns={departureColumns}
                data={data}
                pagination={false}
                hover
                className={`w-full`}
                rowSelection={{
                  type: "radio",
                  onChange: (selectedRowKeys, selectedRows) =>
                    setSelectData(selectedRowKeys, selectedRows, "startTime"),
                }}
              />
            </FormItem>
            {ticketState === "roundTripTicket" && (
              <FormItem label="選擇回程班次" field="endTime" required>
                <Table
                  scroll={{ x: 630 }}
                  rowKey="id"
                  columns={returnTripColumns}
                  data={data}
                  pagination={false}
                  hover
                  className={`w-full`}
                  rowSelection={{
                    type: "radio",
                    onChange: (selectedRowKeys, selectedRows) =>
                      setSelectData(selectedRowKeys, selectedRows, "endTime"),
                  }}
                />
              </FormItem>
            )}
          </div>
          <div className={`flex flex-col gap-[8px] md:flex-row`}>
            <FormItem className={`m-0 md:w-[180px]`}>
              <Button
                onClick={() =>
                  dispatch(orderActions.switchStage("selectStation"))
                }
                className={`w-[100%] !text-[#4E5969] !bg-[#F2F3F5] !m-0`}
                type="primary"
                htmlType="button"
              >
                上一步，重新查詢班次
              </Button>
            </FormItem>
            <FormItem className={`m-0`}>
              <Button
                className={`w-[100%] !bg-[#3A57E8] !m-0`}
                type="primary"
                htmlType="submit"
              >
                下一步，選擇票種數量與座位
              </Button>
            </FormItem>
          </div>
        </Form>
      </div>
      {selectSeatIsOpen() === "block" && (
        <div>
          <Divider
            style={{
              borderBottomStyle: "dashed",
              margin: "16px 0",
            }}
          />
          <div className={`pb-[16px]`}>
            <p className={`text-[#4E5969] pb-[8px]`}>去程班次</p>
            <Table
              scroll={{ x: 630 }}
              columns={departureColumns}
              data={[bookingData.timeData.startTime]}
              rowKey="id"
              pagination={false}
              className={`w-full`}
            />
          </div>
          {ticketState === "roundTripTicket" && (
            <div>
              <p className={`text-[#4E5969] pb-[8px]`}>回程班次</p>
              <Table
                scroll={{ x: 630 }}
                columns={returnTripColumns}
                data={[bookingData.timeData.endTime]}
                rowKey="id"
                pagination={false}
                className={`w-full`}
              />
            </div>
          )}
          <Divider
            style={{
              borderBottomStyle: "dashed",
              margin: "16px 0",
            }}
          />
        </div>
      )}
    </>
  );
};

export default SelectTime;
