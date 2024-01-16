import React, { useEffect, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopAnime } from '../state/anime/animesSlice';
import { AppDispatch, RootState } from '../state/store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AreaChartComponent: React.FC = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector((state: RootState) => state.anime);

  useEffect(() => {
    const fetchAnime = async () => {
      if (status === 'idle') {
        await dispatch(fetchTopAnime());
      }
    };

    fetchAnime();
  }, [dispatch, status]);

  var animesCount: { [id: number] : number; } = {};

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

  // Process data for Recharts

  let chartData: {year: number, count: number}[] = []

  for (const [key, value] of Object.entries(animesCount)) {
    chartData.push({year: parseInt(key), count: value});
  }

  chartData = [...chartData.filter((anime) => !Number.isNaN(anime.year))];

  return (
    <div className="bg-gray-200 pt-5 flex flex-col items-center">
        <div className="font-bold text-xl my-10">Chart</div>
        <div className="flex justify-center">
        {chartData && chartData.length > 0 && (
            <AreaChart width={600} height={400} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        )}
        </div>
    </div>
  );
};

export default AreaChartComponent;
