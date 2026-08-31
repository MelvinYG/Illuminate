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
import { useNavigate } from "react-router-dom";
import { getEnergyData } from "../../lib/energyApi";
import "./tariffChart.css";

ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const TariffHome = () => {
  const [series, setSeries] = useState({ points: [], unit: "INR/kWh" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getEnergyData("/analytics/tariffs?range=today")
      .then((data) => active && setSeries(data))
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load tariff data");
      });
    return () => {
      active = false;
    };
  }, []);

  const chartData = {
    labels: series.points.map((point) => point.timestamp),
    datasets: [{
      label: `Tariff Rate (${series.unit})`,
      data: series.points.map((point) => point.value),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
      pointRadius: 1,
    }],
  };

  return (
    <div
      style={{ maxHeight: "200px" }}
      className="tariff-home p-4"
      onClick={() => navigate("/analytics")}
    >
      <h2>Tariff Rate (Today)</h2>
      {error ? <p>{error}</p> : (
        <Line
          data={chartData}
          options={{
            scales: {
              x: { type: "time", time: { unit: "hour" } },
              y: { title: { display: true, text: `Tariff Rate (${series.unit})` } },
            },
            plugins: { legend: { display: true } },
            maintainAspectRatio: false,
          }}
        />
      )}
    </div>
  );
};

export default TariffHome;
