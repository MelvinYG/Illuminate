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
import "./tariffChart.css";

ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const TariffGraph = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [series, setSeries] = useState({ points: [], unit: "INR/kWh" });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    getEnergyData(`/analytics/tariffs?range=${timeRange}`)
      .then((data) => active && setSeries(data))
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load tariff data");
        }
      });
    return () => {
      active = false;
    };
  }, [timeRange]);

  const chartData = {
    labels: series.points.map((point) => point.timestamp),
    datasets: [{
      label: `Tariff Rate (${series.unit})`,
      data: series.points.map((point) => point.value),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
      pointRadius: timeRange === "today" ? 2 : 0,
    }],
  };

  return (
    <div style={{ maxHeight: "500px" }} className="tariff-graph">
      <h2>Tariff Rate Graph</h2>
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
                time: { unit: timeRange === "today" ? "hour" : "day" },
                title: { display: true, text: "Time" },
              },
              y: {
                title: { display: true, text: `Tariff Rate (${series.unit})` },
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

export default TariffGraph;
