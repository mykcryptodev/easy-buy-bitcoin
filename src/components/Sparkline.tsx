import { type ApexOptions } from "apexcharts";
import { type FC } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(
  () => import(
    "react-apexcharts"),
  { ssr: false } // This line disables server-side rendering
);

type Props = {
  data: number[];
};

export const Sparkline: FC<Props> = ({ data }) => {
  const lastEntry = data[data.length - 1] ?? 0;
  const firstEntry = data[0] ?? 0;
  const trend = lastEntry - firstEntry > 0 ? 'up' : 'down';
  const color = trend === 'up' ? '#10B981' : '#EF4444';

  const series = [{
    data,
  }];
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 40,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 5000
        }
      },
    },
    annotations: {
      points: [{
        x: data.length - 1,
        y: lastEntry,
        marker: {
          size: 10,
          fillColor: color,
          strokeColor: color,
        },
      }],
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    yaxis: {
      min: Math.min(...data),
      max: Math.max(...data),
      labels: {
        show: false,
      },
    },
    colors: [color],
  };
  
  return (
    <ReactApexChart 
      options={options} 
      series={series} 
      type="area" 
      height={"100%"} 
      width={"100%"}
    />
  )
}

export default Sparkline;