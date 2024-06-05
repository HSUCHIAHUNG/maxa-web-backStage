import React, { useEffect, useRef, useState } from "react";
// ui kit
import { DatePicker, Radio, Select } from "@arco-design/web-react";
// echarts
import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
// 時間控制相關
import dayjs, { Dayjs } from "dayjs";

// ui kit
const Option = Select.Option;
const { MonthPicker, YearPicker } = DatePicker;

// echarts type
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

type ReportType = "日報表" | "月報表" | "年報表";

const RoutesCharts: React.FC = () => {
  // 去回程狀態(預設值)
  const [position, setPosition] = useState("去程");
  // 日、月、年報表狀態(預設值)
  const [reportType, setReportType] = useState<ReportType>("日報表");
  // 路線狀態(預設值)
  const [selectedRoute, setSelectedRoute] = useState("501大溪快線");
  // 日期狀態(預設值)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "days")
  );

  // 設定chart容器
  const chartRef = useRef<HTMLDivElement>(null);
  // echarts配置
  echarts.use([GridComponent, BarChart, CanvasRenderer, UniversalTransition]);

  // 路線選項
  const routeOptions = ["501大溪快線", "502桃園快線"];

  // 模擬API取得圖表資料
  const fetchData = (
    _route: string,
    _direction: string,
    _date: Dayjs | null,
    type: ReportType
  ) => {
    // charts資料
    const dataMapping: Record<
      ReportType,
      { xAxisData: string[]; seriesData: number[] }
    > = {
      日報表: {
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i < 10 ? "0"+i : i}:15`
        ),
        seriesData: Array.from({ length: 24 }, () =>
          Math.floor(Math.random() * 100)
        ),
      },
      月報表: {
        xAxisData: Array.from({ length: 24 }, (_, i) => `${i < 10 ? "0"+i : i}:00`),
        seriesData: Array.from({ length: 24 }, () =>
          Math.floor(Math.random() * 100)
        ),
      },
      年報表: {
        xAxisData: Array.from({ length: 24 }, (_, i) => `${i < 10 ? "0"+i : i}:00`),
        seriesData: Array.from({ length: 24 }, () =>
          Math.floor(Math.random() * 100)
        ),
      },
    };
    return dataMapping[type];
  };

  // 依據選項變更圖表內容
  useEffect((): (() => void) => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const updateChart = () => {
        const { xAxisData, seriesData } = fetchData(
          selectedRoute,
          position,
          selectedDate,
          reportType
        );

        const option: EChartsOption = {
          xAxis: {
            type: "category",
            data: xAxisData,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: seriesData,
              type: "bar",
              itemStyle: {
                color: "#3A57E8", // 柱狀圖顏色
                borderRadius: [5, 5, 0, 0], // 圓角設置
              },
            },
          ],
        };

        myChart.setOption(option);
      };

      updateChart();

      const handleResize = () => {
        myChart?.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        myChart?.dispose();
      };
    }
    return () => {}; // 返回一個空的清理函數來避免錯誤
  }, [selectedRoute, position, selectedDate, reportType]);

  //
  const handleDateChange = (_dateString: string, date: Dayjs) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-[80%] py-[16px] m-[0_auto] flex flex-col">
      {/* 標題、篩選 */}
      <div className="flex justify-between items-center w-full pb-[16px]">
        {/* 左-日、月、年報表 */}
        <div className="flex gap-[8px]">
          <p className="text-[20px] text-[#1D2129]">
            路線時段預約售票數量統計(發車時間)
          </p>
          <ul className="flex items-center text-[#4E5969]">
            <li>
              <button
                onClick={() => setReportType("日報表")}
                className={`${reportType === "日報表" && "text-[#3A57E8]"}`}
              >
                日報表
              </button>
            </li>
            <li className="mx-[8px] border-r-[2px] border-solid border-[#E4E6EF] h-[12px]"></li>
            <li>
              <button
                onClick={() => setReportType("月報表")}
                className={`${reportType === "月報表" && "text-[#3A57E8]"}`}
              >
                月報表
              </button>
            </li>
            <li className="mx-[8px] border-r-[2px] border-solid border-[#E4E6EF] h-[12px]"></li>
            <li>
              <button
                onClick={() => setReportType("年報表")}
                className={`${reportType === "年報表" && "text-[#3A57E8]"}`}
              >
                年報表
              </button>
            </li>
          </ul>
        </div>

        {/* 右-路線、去回程、日期 */}
        <div className="flex gap-[8px]">
          {/* 訂單編號篩選 */}
          <div className="w-[175px]">
            <Select
              addBefore="路線"
              placeholder="Please select"
              onChange={(value) => setSelectedRoute(value)}
              value={selectedRoute}
            >
              {routeOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          {/* 去程、回程 */}
          <Radio.Group
            onChange={setPosition}
            type="button"
            name="direction"
            value={position}
            options={["去程", "回程"]}
          ></Radio.Group>

          {/* 日期篩選-日 */}
          {reportType === "日報表" && (
            <DatePicker
              shortcutsPlacementLeft
              placeholder="請選擇日期"
              value={selectedDate ?? undefined}
              disabledDate={(current) =>
                current.isAfter(dayjs().subtract(1, "days"))
              }
              onChange={handleDateChange}
              shortcuts={[
                {
                  text: "昨天",
                  value: () => dayjs().subtract(1, "day"),
                },
                {
                  text: "今天",
                  value: () => dayjs(),
                },
                {
                  text: "1週前",
                  value: () => dayjs().subtract(1, "week"),
                },
                {
                  text: "1個月前",
                  value: () => dayjs().subtract(1, "month"),
                },
                {
                  text: "3個月前",
                  value: () => dayjs().subtract(3, "month"),
                },
                {
                  text: "6個月前",
                  value: () => dayjs().subtract(6, "month"),
                },
              ]}
              className="w-[240px]"
            />
          )}

          {/* 日期篩選-月 */}
          {reportType === "月報表" && (
            <MonthPicker
              value={dayjs().subtract(1, "months")}
              onChange={(_dateString, date) =>
                handleDateChange(_dateString, date)
              }
              disabledDate={(current) =>
                current.isAfter(dayjs().subtract(1, "months"))
              }
              defaultValue={dayjs()}
              className="w-[240px]"
            />
          )}

          {/* 日期篩選-年 */}
          {reportType === "年報表" && (
            <YearPicker
              value={dayjs().subtract(1, "years")}
              disabledDate={(current) =>
                current.isAfter(dayjs().subtract(1, "years"))
              }
              onChange={(_dateString, date) =>
                handleDateChange(_dateString, date)
              }
              defaultValue="2019"
              className="w-[240px]"
            />
          )}
        </div>
      </div>

      {/* 圖表內容 */}
      <div id="main" ref={chartRef} style={{ height: "700px" }}></div>
    </div>
  );
};

export default RoutesCharts;
