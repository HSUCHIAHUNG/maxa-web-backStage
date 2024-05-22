import React, { useEffect, useRef, useState } from "react";
// ui kit
import { DatePicker, Radio, Select } from "@arco-design/web-react";
// echarts
import * as echarts from "echarts/core";
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
// 時間控制相關
import dayjs, { Dayjs } from "dayjs";

// ui kit
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// echarts type
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

type ReportType = "週報表" | "月報表" | "季報表";

const IndustryCharts: React.FC = () => {
  // 去回程狀態(預設值)
  const [position, setPosition] = useState("去程");
  // 日、月、季報表狀態(預設值)
  const [reportType, setReportType] = useState<ReportType>("週報表");
  // 路線狀態(預設值)
  const [selectedRoute, setSelectedRoute] = useState("501大溪快線");
  // 單一日期狀態(預設值)
  const [singleDate, setSingleDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "days")
  );
  // 日期範圍狀態(預設值)
  const [rangeDate, setRangeDate] = useState<Dayjs[] | null>(null);

  // 設定chart容器
  const chartRef = useRef<HTMLDivElement>(null);
  // echarts配置
  echarts.use([
    GridComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    LegendComponent,
  ]);

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
      { xAxisData: string[]; seriesData: { name: string; data: number[] }[] }
    > = {
      週報表: {
        xAxisData: [
          "第1班",
          "第2班",
          "第3班",
          "第4班",
          "第5班",
          "第6班",
          "第7班",
          "第8班",
          "第9班",
          "第10班",
          "第11班",
          "第12班",
          "第13班",
        ],
        seriesData: [
          {
            name: "501 大溪快線",
            data: [3, 26, 38, 35, 27, 15, 21, 6, 9, 18, 21, 9, 15],
          },
          {
            name: "502 小烏來線(假日行駛)",
            data: [4, 18, 25, 40, 30, 20, 30, 10, 8, 15, 17, 10, 20],
          },
          {
            name: "503 石門水庫線(假日行駛)",
            data: [5, 20, 30, 25, 35, 22, 28, 15, 12, 20, 23, 12, 18],
          },
          {
            name: "506 東眼山線",
            data: [6, 22, 35, 30, 25, 20, 32, 14, 10, 18, 25, 14, 22],
          },
        ],
      },
      月報表: {
        xAxisData: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        seriesData: [
          {
            name: "501 大溪快線",
            data: [300, 260, 380, 350, 270, 150, 210, 60, 90, 180, 210, 90],
          },
          {
            name: "502 小烏來線(假日行駛)",
            data: [280, 240, 350, 330, 250, 140, 200, 50, 80, 170, 200, 80],
          },
          {
            name: "503 石門水庫線(假日行駛)",
            data: [320, 270, 400, 360, 290, 160, 220, 70, 100, 190, 220, 100],
          },
          {
            name: "506 東眼山線",
            data: [310, 250, 370, 340, 260, 140, 200, 60, 90, 180, 210, 90],
          },
        ],
      },
      季報表: {
        xAxisData: ["Q1", "Q2", "Q3", "Q4"],
        seriesData: [
          {
            name: "501 大溪快線",
            data: [900, 800, 1200, 1000],
          },
          {
            name: "502 小烏來線(假日行駛)",
            data: [850, 750, 1150, 950],
          },
          {
            name: "503 石門水庫線(假日行駛)",
            data: [1000, 900, 1300, 1100],
          },
          {
            name: "506 東眼山線",
            data: [950, 850, 1250, 1050],
          },
        ],
      },
    };
    return dataMapping[type];
  };

  // 依據選項變更圖表內容
  useEffect((): (() => void) => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const updateChart = () => {
        let date: Dayjs | null = null;
        if (reportType === "週報表" || reportType === "月報表") {
          date = singleDate;
        } else if (reportType === "季報表") {
          date = rangeDate ? rangeDate[0] : null;
        }

        const { xAxisData, seriesData } = fetchData(
          selectedRoute,
          position,
          date,
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
          legend: {
            left: "left",
            data: seriesData.map((series) => series.name),
          },
          series: seriesData.map((series) => ({
            name: series.name,
            data: series.data,
            type: "line",
          })),
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
  }, [selectedRoute, position, singleDate, rangeDate, reportType]);

  //
  const handleDateChange = (_: string | string[], date: Dayjs | Dayjs[]) => {
    if (Array.isArray(date)) {
      setRangeDate(date);
    } else {
      setSingleDate(date);
    }
  };

  return (
    <div className="w-[80%] py-[16px] m-[0_auto] flex flex-col">
      {/* 標題、篩選 */}
      <div className="flex justify-between items-center w-full pb-[16px]">
        {/* 左-日、月、季報表 */}
        <div className="flex gap-[8px]">
          <p className="text-[20px] text-[#1D2129]">路線班次預約數量統計</p>
          <ul className="flex items-center text-[#4E5969]">
            <li>
              <button
                onClick={() => setReportType("週報表")}
                className={`${reportType === "週報表" && "text-[#3A57E8]"}`}
              >
                週報表
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
                onClick={() => setReportType("季報表")}
                className={`${reportType === "季報表" && "text-[#3A57E8]"}`}
              >
                季報表
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

          {/* 日期篩選-週 */}
          {reportType === "週報表" && (
            <WeekPicker
              onChange={(_dateString, date) =>
                handleDateChange(_dateString, date)
              }
              value={dayjs().subtract(1, "weeks")}
              disabledDate={(current) =>
                current.isAfter(dayjs().subtract(1, "weeks"))
              }
              placeholder="請選擇日期"
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
              className="w-[240px]"
            />
          )}

          {/* 日期篩選-季 */}
          {reportType === "季報表" && (
            <RangePicker
              value={
                [dayjs().subtract(6, "months"), dayjs().subtract(3, "months")] ??
                undefined
              }
              onChange={(_dateString, dates) =>
                handleDateChange(_dateString, dates as Dayjs[])
              }
              mode="quarter"
              placeholder={["開始季度", "結束季度"]}
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

export default IndustryCharts;
