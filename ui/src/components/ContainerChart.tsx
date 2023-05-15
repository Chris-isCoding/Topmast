import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppContext } from '../context/AppContext';

const ContainerChart = () => {
  const { currentContainer, stats } = useAppContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentContainer && stats[currentContainer]) {
        const cpuData = {
          name: new Date().toLocaleTimeString(), // timestamp as a string
          CPU: parseFloat(stats[currentContainer].cpu),
        };
        setChartData((prevData) => {
          const newData = [...prevData, cpuData];
          // Only keep the last 60 data points
          return newData.slice(Math.max(newData.length - 60, 0));
        });
      }
    }, 5000); // update every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentContainer, stats, chartData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="CPU"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ContainerChart;
