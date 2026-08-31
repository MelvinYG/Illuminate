import "./solarProdChart.css";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { getEnergyData } from "../../lib/energyApi";

ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const SolarProdChart = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [series, setSeries] = useState({ points: [], unit: "kW", interval: "hour" });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    getEnergyData(`/analytics/solar-production?range=${timeRange}`)
      .then((data) => active && setSeries(data))
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load solar-production data");
        }
      });
    return () => {
      active = false;
    };
  }, [timeRange]);

  const chartData = {
    labels: series.points.map((point) => point.timestamp),
    datasets: [{
      label: `Solar Production (${series.unit})`,
      data: series.points.map((point) => point.value),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
      pointRadius: series.interval === "hour" ? 2 : 4,
    }],
  };

  return (
    <div style={{ maxHeight: "500px" }} className="tariff-graph">
      <h2>Solar Production Graph</h2>
      <div className="btn-container">
        <button onClick={() => setTimeRange("today")}>Today</button>
        <button onClick={() => setTimeRange("week")}>1 Week</button>
        <button onClick={() => setTimeRange("month")}>1 Month</button>
      </div>
      {error ? <p>{error}</p> : (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: "time",
                time: { unit: series.interval === "hour" ? "hour" : "day" },
                title: { display: true, text: "Time" },
              },
              y: {
                title: { display: true, text: `Solar Production (${series.unit})` },
              },
            },
            plugins: { legend: { display: true } },
            maintainAspectRatio: false,
          }}
        />
      )}
    </div>
  );
};

export default SolarProdChart;
