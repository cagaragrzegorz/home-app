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
    console.log(date.getDate());
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
        label: "Temperature (°C)",
        data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.2,
      },
      {
        label: "Max Temperature (°C)",
        data: data_max ? data_max : [],
        fill: false,
        borderColor: "green",
        tension: 0.2,
      },
      {
        label: "Min Temperature (°C)",
        data: data_min ? data_min : [],
        fill: false,
        borderColor: "yellow",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
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

  return <Line data={chartData} options={options} />;
};

export default TemperatureLineGraph;


// import React from "react";
// import { Line } from "react-chartjs-2";
// import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
//
// Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);
//
// interface TemperatureLineGraphProps {
//   data: number[];
//   firstHour: number;
// }
//
// const TemperatureLineGraph: React.FC<TemperatureLineGraphProps> = ({ data, firstHour }) => {
//   const labels = data.map((_, idx) => {
//     const hour = (firstHour + idx) % 24;
//     return `${hour < 10 ? "0" : ""}${hour}:00`;
//   });
//
//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Temperature (°C)",
//         data,
//         fill: false,
//         borderColor: "rgba(75,192,192,1)",
//         tension: 0.2,
//       },
//     ],
//   };
//
//   return <Line data={chartData} />;
// };
//
// export default TemperatureLineGraph;