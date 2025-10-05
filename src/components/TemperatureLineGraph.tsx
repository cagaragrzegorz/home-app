import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface TemperatureLineGraphProps {
  data: number[];
  data_min: number[];
  data_max: number[];
  firstHour: number;
  startDate: string; // ISO string
}

const TemperatureLineGraph: React.FC<TemperatureLineGraphProps> = ({ data, data_min, data_max, firstHour, startDate }) => {
  const baseDate = new Date(startDate);

    if (data.length > 30) {
        data = data.slice(0, 30);
    } else if (data.length < 30) {
        const missingPoints = Array(30 - data.length).fill(null);
        data = [...data, ...missingPoints];
    }

  // Prepare labels for each data point
  const labels = data.map((_, idx) => {
    const date = new Date(baseDate.getTime());
    date.setHours(date.getHours() + idx + firstHour + 3);
    const day = (date.getDate()-1).toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    return {
      full: `${day}/${month} ${hour}:00`,
      hour: `${hour}:00`,
      day: `${day}/${month}`
    };
  });

  const chartData = {
    labels: labels.map(l => l.full),
    datasets: [
      {
        label: "Temperatura (°C)",
        data,
        fill: false,
        borderColor: "#feff00",
        tension: 0.2,
      },
      {
        label: "Max Temperatura (°C)",
        data: data_max ? data_max : [],
        fill: false,
        borderColor: "#335e33",
        tension: 0.2,
      },
      {
        label: "Min Temperatura (°C)",
        data: data_min ? data_min : [],
        fill: false,
        borderColor: "#4b7a7a",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: {color: "white"} },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: {
        ticks: {
          callback: function(value: any, index: number) {
            const label = labels[index];
            return label.hour === "00:00" ? label.full : label.hour;
          },
          color: "#fff",
          minRotation: 40,
          maxRotation: 40,
          autoSkip: false,
        },
        grid: { color: "#444" },
      },
      y: {
        grid: { color: "#444" },
        ticks: { color: "#fff" },
      },
    },
  };


  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDraw: (chart: any) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      chart.data.labels.forEach((label: string, index: number) => {
        if (label.includes('00:00')) {
          const x = xAxis.getPixelForTick(index);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          // ctx.setLineDash([5, 5]); // optional: dashed line
          ctx.stroke();
          ctx.restore();
        }
      });
    },
  };


  //@ts-ignore
  return <Line data={chartData} options={options} plugins={[verticalLinePlugin]}/>;
};

export default TemperatureLineGraph;