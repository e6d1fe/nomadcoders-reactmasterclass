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

function Price({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IData[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId));
  const isDark = useRecoilValue(isDarkAtom);
  const mappedData = data?.map((price: IData) => ({
    x: price.time_close,
    y: [Number(price.open), Number(price.high), Number(price.low), Number(price.close)],
  }));

  return (
    <div>
      {isLoading ? (
        "Loading chart ..."
      ) : (
        <ReactApexChart
          type="candlestick"
          series={[
            {
              name: "Price",
              data: mappedData as any[],
            },
          ]}
          options={{
            chart: {
              type: "candlestick",
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              labels: {
                show: false,
              },
              axisTicks: {
                color: "#78909c",
              },
              categories: data?.map((price) => price.time_close * 1000),
              type: "datetime",
            },
            yaxis: {
              show: false,
            },
            theme: {
              mode: isDark ? "dark" : "light",
            },
          }}
        />
      )}
    </div>
  );
}

export default Price;
