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
// 匯入圖片
// import emptyImg from "../../assets/images/empty-state.png";

// ui kit
const Option = Select.Option;
const { RangePicker, WeekPicker } = DatePicker;

// echarts type
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

type ReportType = "週報表" | "月報表" | "季報表";

const IndustryCharts: React.FC = () => {
  // 無資料圖表顯示狀態
  const emptyData = useRef(false);

  // 去回程狀態(預設值)
  const [position, setPosition] = useState("去程");

  // 日、月、季報表狀態(預設值)
  const [reportType, setReportType] = useState<ReportType>("週報表");

  // 路線狀態(預設值)
  const [selectedRoute, setSelectedRoute] = useState("501大溪快線");

  // 單一日期狀態(預設值)
  const [singleDate, setSingleDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "week").startOf("week")
  );

  // 日期範圍狀態(預設值)
  const [rangeDate, setRangeDate] = useState<Dayjs[]>([
    dayjs().subtract(12, "month").startOf("month"),
    dayjs().subtract(1, "month").endOf("month"),
  ]);

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

  // 變更tab
  function chengeReportType(reportType: ReportType) {
    setReportType(reportType);
    emptyData.current = false;
  }

  // 模擬API取得圖表資料
  const fetchData = (
    _route: string,
    _direction: string,
    _date: Dayjs | null,
    type: ReportType
  ) => {
    const dataMapping: Record<
      ReportType,
      { xAxisData: string[]; seriesData: { name: string; data: number[] }[] }
    > = {
      週報表: {
        xAxisData: [],
        seriesData: [
          {
            name: "501 大溪快線",
            data: [3, 26, 38, 35, 27, 15, 21],
          },
          {
            name: "502 小烏來線(假日行駛)",
            data: [4, 18, 25, 40, 30, 20, 30],
          },
          {
            name: "503 石門水庫線(假日行駛)",
            data: [5, 20, 30, 25, 35, 22, 28],
          },
          {
            name: "506 東眼山線",
            data: [6, 22, 35, 30, 25, 20, 32],
          },
        ],
      },
      月報表: {
        xAxisData: [],
        seriesData: [
          {
            name: "501 大溪快線",
            data: [],
          },
          {
            name: "502 小烏來線(假日行駛)",
            data: [],
          },
          {
            name: "503 石門水庫線(假日行駛)",
            data: [],
          },
          {
            name: "506 東眼山線",
            data: [],
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

    if (_date && type === "週報表") {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(_date.startOf("week").add(i, "day").format("MM-DD"));
      }
      dataMapping.週報表.xAxisData = weekDays;
    }

    if (rangeDate && type === "月報表") {
      const startDate = rangeDate[0];
      const endDate = rangeDate[1];
      const months = [];
      const diff = endDate.diff(startDate, "month");
      for (let i = 0; i <= diff; i++) {
        months.push(startDate.add(i, "month").format("YYYY-MM"));
      }

      if (months.length !== 12) {
        emptyData.current = true;
        return { xAxisData: [], seriesData: [] };
      }

      dataMapping.月報表.xAxisData = months;
      dataMapping.月報表.seriesData.forEach((series) => {
        series.data = Array(months.length)
          .fill(0)
          .map(() => Math.floor(Math.random() * 100) + 50);
      });
      emptyData.current = false;
    }

    return dataMapping[type];
  };

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

        if (emptyData.current) {
          myChart.clear(); // 清空图表
          return;
        }

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
    return () => {}; // 返回一个空的清理函数来避免错误
  }, [selectedRoute, position, singleDate, rangeDate, reportType]);

  const handleDateChange = (_: string | string[], date: Dayjs | Dayjs[]) => {
    if (reportType === "月報表" && Array.isArray(date)) {
      const startDate = date[0];
      const endDate = date[1];
      const months = [];
      const diff = endDate.diff(startDate, "month");

      for (let i = 0; i <= diff; i++) {
        months.push(startDate.add(i, "month").format("YYYY-MM"));
      }

      if (months.length !== 12) {
        emptyData.current = true;
      } else {
        emptyData.current = false;
      }

      setRangeDate(date);
    } else if (!Array.isArray(date)) {
      setSingleDate(date);
    }

    // if (reportType !== "月報表" && Array.isArray(date)) {
    //   emptyData.current = false;
    //   setRangeDate(date);
    // } else if (!Array.isArray(date)) {
    //   emptyData.current = false;
    //   setSingleDate(date);
    // }
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
                onClick={() => chengeReportType("週報表")}
                className={`${reportType === "週報表" && "text-[#3A57E8]"}`}
              >
                週報表
              </button>
            </li>
            <li className="mx-[8px] border-r-[2px] border-solid border-[#E4E6EF] h-[12px]"></li>
            <li>
              <button
                onClick={() => chengeReportType("月報表")}
                className={`${reportType === "月報表" && "text-[#3A57E8]"}`}
              >
                月報表
              </button>
            </li>
            <li className="mx-[8px] border-r-[2px] border-solid border-[#E4E6EF] h-[12px]"></li>
            <li>
              <button
                onClick={() => chengeReportType("季報表")}
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
              value={singleDate || undefined}
              disabledDate={(current) => current.isAfter(dayjs())}
              placeholder="請選擇日期"
              className="w-[240px]"
            />
          )}

          {/* 日期篩選-月 */}
          {reportType === "月報表" && (
            <RangePicker
              mode={"month"}
              onChange={(_dateString, dates) =>
                handleDateChange(_dateString, dates)
              }
              value={rangeDate || undefined}
              disabledDate={(current) => current.isAfter(dayjs())}
              className="w-[240px]"
            />
          )}

          {/* 日期篩選-季 */}
          {reportType === "季報表" && (
            <RangePicker
              value={[
                dayjs().subtract(6, "months"),
                dayjs().subtract(3, "months"),
              ]}
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
      {emptyData.current === false ? (
        <div id="main" ref={chartRef} style={{ height: "700px" }}></div>
      ) : (
        <p>無資料</p>
      )}
    </div>
  );
};

export default IndustryCharts;
