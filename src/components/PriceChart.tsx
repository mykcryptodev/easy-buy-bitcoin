import { useEffect, useMemo, useState, type FC } from "react";
import ReactApexChart from "react-apexcharts";
import { CB_BTC_COINGECKO_ID } from "~/constants";
import { api } from "~/utils/api";
import type { ApexOptions } from "apexcharts";
import { type GetWalletTokenTransfersResponseAdapter } from "moralis/common-evm-utils";

// Add this type definition at the top of the file
type SeriesData = {
  name: string;
  data: (number | null)[];
};

type Props = {
  buys?: GetWalletTokenTransfersResponseAdapter['result'];
  sells?: GetWalletTokenTransfersResponseAdapter['result'];
}

export const PriceChart: FC<Props> = ({ buys, sells }) => {
  const [days, setDays] = useState<number | undefined>(180);
  const { data: rawData } = api.coingecko.getMarketChart.useQuery({ 
    id: CB_BTC_COINGECKO_ID, 
    days,
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const aggregatedData = useMemo(() => {
    if (!rawData) return null;

    const dailyData = new Map<string, { sum: number; count: number }>();

    rawData.forEach(([timestamp, price]) => {
      const date = new Date(timestamp).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, { sum: price, count: 1 });
      } else {
        const current = dailyData.get(date)!;
        dailyData.set(date, { sum: current.sum + price, count: current.count + 1 });
      }
    });

    return Array.from(dailyData).map(([date, { sum, count }]) => [
      new Date(date).getTime(),
      sum / count
    ]);
  }, [rawData]);

  const options = useMemo(() => {
    if (!aggregatedData) return null;

    const buyAnnotations = buys?.map(buy => {
      const buyTime = new Date(buy.blockTimestamp).getTime();
      const closestDataPoint = aggregatedData.reduce((prev, curr) => 
        Math.abs(curr[0]! - buyTime) < Math.abs(prev[0]! - buyTime) ? curr : prev
      );
      return {
        x: closestDataPoint[0],
        y: closestDataPoint[1],
        marker: {
          size: 6,
          fillColor: "#fff",
          strokeColor: "#36D399",
        },
        label: {
          borderColor: "#36D399",
          style: {
            color: "#fff",
            background: "#36D399",
          },
          text: `Buy`,
        }
      };
    }) ?? [];

    const sellAnnotations = sells?.map(sell => {
      const sellTime = new Date(sell.blockTimestamp).getTime();
      const closestDataPoint = aggregatedData.reduce((prev, curr) => 
        Math.abs(curr[0]! - sellTime) < Math.abs(prev[0]! - sellTime) ? curr : prev
      );
      return {
        x: closestDataPoint[0],
        y: closestDataPoint[1],
        marker: {
          size: 6,
          fillColor: "#fff",
          strokeColor: "#F87272",
        },
        label: {
          borderColor: "#F87272",
          style: {
            color: "#fff",
            background: "#F87272",
          },
          text: `Sell`,
        }
      };
    }) ?? [];

    return {
      series: [{
        name: "Bitcoin",
        data: aggregatedData.map(([_, y]) => y ?? null)
      }] as SeriesData[],
      options: {
        chart: {
          type: 'area',
          height: 350,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 0,
        },
        labels: aggregatedData.map(([x]) => new Date(x!).toLocaleDateString()),
        xaxis: {
          type: 'datetime',
          labels: {
            show: false,
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          opposite: true,
          labels: {
            formatter: (value: number) => {
              return `$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}`;
            },
            show: false,
          },
        },
        legend: {
          show: false // Hide the legend to remove extra space
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        tooltip: {
          enabled: true,
          custom: ({ series, seriesIndex, dataPointIndex, w } : {
            series: number[][],
            seriesIndex: number,
            dataPointIndex: number,
            w: { globals: { seriesX: number[][] } }
          }) => {
            const value = series[seriesIndex]![dataPointIndex];
            const timestamp = w.globals.seriesX[seriesIndex]![dataPointIndex]!;
            const date = new Date(timestamp);
            const formattedDate = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            const formattedPrice = value!.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            
            return `
              <div class="custom-tooltip px-2 py-1 text-center">
                <div class="tooltip-date text-xs">${formattedDate}</div>
                <div class="tooltip-price font-bold">${formattedPrice}</div>
              </div>
            `;
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: () => '',
            },
          },
          marker: {
            show: false,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            gradientToColors: undefined,
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
            colorStops: []
          }
        },
        annotations: {
          points: [...buyAnnotations, ...sellAnnotations],
        },
      } as ApexOptions,
    };
  }, [aggregatedData, buys, sells]);

  if (typeof window === 'undefined' || !isMounted) return null;
  
  return (
    <div className="w-full h-full">
      {options && (
        <ReactApexChart 
          options={options.options} 
          series={options.series} 
          type="area"
          height="100%"
          width="100%" 
        />
      )}
    </div>
  )
};

export default PriceChart;