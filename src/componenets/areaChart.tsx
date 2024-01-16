import React, { useEffect, useState, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopAnime } from "../state/anime/animesSlice";
import { AppDispatch, RootState } from "../state/store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// CustomTooltip component for the Tooltip content
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const year = label;
    const animeNames: string[] = payload[0].payload.animeNames;

    return (
      <div className="custom-tooltip bg-white border-2 border-red-500 rounded-lg p-5 flex flex-col justify-center items-center">
        <p className="label font-bold">{year}</p>
        {animeNames.map((animeName: string) => (
          <p key={animeName}>{animeName}</p>
        ))}
      </div>
    );
  }

  return null;
};

const AreaChartComponent: React.FC = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.anime);
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.8);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchAnime = async () => {
      if (status === "idle") {
        await dispatch(fetchTopAnime());
      }
    };

    fetchAnime();
  }, [dispatch, status]);

  var animesCount: { [id: number]: number } = {};

  for (let i = 0; i < data.length; i++) {
    if (data[i].release === undefined) {
      continue;
    }
    if (animesCount[data[i].release!] === undefined) {
      animesCount[data[i].release!] = 1;
    } else {
      animesCount[data[i].release!] += 1;
    }
  }

  let chartData: { year: number; count: number; animeNames: string[] }[] = [];

  for (const [key, value] of Object.entries(animesCount)) {
    chartData.push({
      year: parseInt(key),
      count: value,
      animeNames: [],
    });
  }

  chartData = chartData.filter((anime) => !Number.isNaN(anime.year));

  // Build an object containing anime names for each year
  const animeNamesByYear: { [year: number]: string[] } = {};
  data.forEach((anime) => {
    const year = anime.release;
    if (year && animeNamesByYear[year]) {
      animeNamesByYear[year].push(anime.title);
    } else if (year) {
      animeNamesByYear[year] = [anime.title];
    }
  });

  // Update chartData to include animeNames
  chartData.forEach((item) => {
    const year = item.year;
    item.animeNames = animeNamesByYear[year] || [];
  });

  return (
    <div className="pt-5 flex flex-col items-center">
      <div className="flex justify-center">
        {chartData && chartData.length > 0 && (
          <AreaChart
            width={chartWidth}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#0eb5a4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#114f54" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="url(#colorGradient)"
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
};

export default AreaChartComponent;
