// react原生方法
import React, { useState } from "react";
// redux
import { useSelector } from "react-redux";
import { orderActions } from "../../stores/order";
import { RootState, useAppDispatch } from "../../stores/index";
// 匯入型別
import { ProductDetailType } from "../../pages/Reserve/type";
import { StationDataType } from '../../stores/type/OrderType'
// ui kit
import {
  Form,
  Button,
  Divider,
  Select,
  DatePicker,
} from "@arco-design/web-react";
// 時間控制相關
import dayjs from "dayjs";

interface SelectStationProps {
  productDetail: ProductDetailType;
  className?: string;
}

const SelectStation: React.FC<SelectStationProps> = ({
  className,
  productDetail,
}) => {
  // redux(方法調用)
  const dispatch = useAppDispatch();

  // ui kit
  const FormItem = Form.Item;
  const [form] = Form.useForm();

  // 依據去程日期動態調整回程日期禁用狀態
  const [timeDates, setTimeDates] = useState<dayjs.Dayjs | null>(null);

  // 訂車階段(起訖站、日期、時間狀態)
  const bookingStage = useSelector(
    (state: RootState) => state.order.bookingStage
  );

  // ticket( 單程票、來回票 )狀態
  const ticketState = useSelector((state: RootState) => state.order.ticket);

  // 站點資訊
  const stations = productDetail.stations.map((station) => station.name)

  // login表單提交
  const submit = (value: StationDataType) => {
    // redux(切換tab全域狀態)
    dispatch(orderActions.switchStage("selectTime"));
    // redux儲存起訖點與日期資料
    dispatch(orderActions.setStationData(value));
  };

  // 控制訂車階段顯示
  const isOpen = () => (bookingStage !== "selectStation" ? "hidden" : "block");

  return (
    <Form
      form={form}
      autoComplete="on"
      requiredSymbol={{ position: "start" }}
      layout="vertical"
      onSubmit={submit}
      className={` ${className}`}
    >
      {/* 選擇站點 */}
      <div className={`md:flex md:gap-[20px] md:w-[420px] `}>
        <FormItem
          label="選擇起點"
          field="startStation"
          disabled={bookingStage !== "selectStation"}
          required
          rules={[{ required: true, message: "必填" }]}
        >
          <Select
            placeholder="選擇起點"
            options={stations}
            allowClear
          />
        </FormItem>
        <FormItem
          label="選擇迄點"
          field="endStation"
          disabled={bookingStage !== "selectStation"}
          required
          dependencies={["startStation"]}
          rules={[
            {
              required: true,
              validator: (v, cb) => {
                console.log(v, form.getFieldValue("startStation"));
                if (v === undefined) {
                  return cb("必填");
                }
                if (form.getFieldValue("startStation") === v) {
                  return cb("起訖點不可相同");
                }
                cb(null);
              },
            },
          ]}
        >
          <Select
            placeholder="選擇迄點"
            options={stations}
            allowClear
          />
        </FormItem>
      </div>
      {/* 選擇日期 */}
      <div className={`md:flex md:gap-[20px] md:w-[420px] `}>
        <FormItem
          label="去程日期"
          field="startDate"
          disabled={bookingStage !== "selectStation"}
          rules={[{ required: true, message: "必填" }]}
          className={`${ticketState === "oneWayTicket" && "md:w-[200px]"} `}
        >
          <DatePicker
            onSelect={(_valueString, value) => {
              setTimeDates(value);
            }}
            disabledDate={(current) => current.isBefore(dayjs())}
            placeholder="選擇去程日期"
            className={`w-full`}
          />
        </FormItem>
        {ticketState === "roundTripTicket" && (
          <FormItem
            label="回程日期"
            field="endDate"
            disabled={bookingStage !== "selectStation"}
            // disabled={bookingStage !== "selectStation"}
            rules={[
              {
                message: "必填",
                required: true,
              },
            ]}
          >
            <DatePicker
              disabledDate={(current) => {
                if (timeDates) {
                  const beforeDtae = current.isBefore(dayjs());
                  const selected = current.isBefore(timeDates);
                  return beforeDtae || selected;
                }
                return false;
              }}
              placeholder="選擇回程日期"
              className={`w-full`}
            />
          </FormItem>
        )}
      </div>

      <Divider
        className={isOpen()}
        style={{
          borderBottomStyle: "dashed",
          margin: "16px 0",
        }}
      />
      <FormItem className={`m-0 ${isOpen()}`}>
        <Button
          className={`w-[100%] !bg-[#3A57E8] !m-0 `}
          type="primary"
          htmlType="submit"
        >
          下一步，查詢班次
        </Button>
      </FormItem>
    </Form>
  );
};

export default SelectStation;
