import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface ChartProps {
  coinId: string;
}

interface IData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IData[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId));
  const isDark = useRecoilValue(isDarkAtom);
  const mappedData = data?.map((price: IData) => ({
    x: price.time_close * 1000,
    y: [Number(price.open), Number(price.high), Number(price.low), Number(price.close)],
  }));

  return (
    <div>
      {isLoading ? (
        "Loading chart ..."
      ) : (
        <ReactApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => Number(price.close)) as number[],
            },
          ]}
          options={{
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
            },
            theme: {
              mode: "dark",
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((price) => price.time_open * 1000),
              labels: {
                show: false,
              },
            },
            yaxis: {
              labels: {
                show: false,
              },
            },
            colors: ["#008200"],
          }}
        />
      )}
    </div>
  );
}

export default Chart;
