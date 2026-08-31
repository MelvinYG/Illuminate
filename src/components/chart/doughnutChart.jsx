import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getEnergyData } from "../../lib/energyApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = {
  solar: "#4caf50",
  grid: "#f44336",
  battery: "#2196f3",
  other: "#ff9800",
};

const EnergyDoughnutChart = () => {
  const [mix, setMix] = useState({
    sources: [],
    selfPoweredPercentage: 0,
    label: "Self Powered",
    comment: "Loading energy data…",
  });

  useEffect(() => {
    let active = true;
    getEnergyData("/analytics/energy-mix")
      .then((data) => active && setMix(data))
      .catch((error) => {
        if (active) {
          setMix((current) => ({
            ...current,
            comment: error.response?.data?.message || "Unable to load energy-source data",
          }));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const data = {
    labels: mix.sources.map(({ source }) => source[0].toUpperCase() + source.slice(1)),
    datasets: [{
      label: "Energy Source",
      data: mix.sources.map(({ percentage }) => percentage),
      backgroundColor: mix.sources.map(({ source }) => COLORS[source] || COLORS.other),
      hoverOffset: 4,
      borderWidth: 0,
    }],
  };

  return (
    <div>
      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        <Doughnut
          data={data}
          options={{
            cutout: "70%",
            responsive: true,
            plugins: { tooltip: { enabled: true }, legend: { display: false } },
          }}
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          textAlign: "center",
        }}>
          <span>{mix.selfPoweredPercentage}%</span>
          <br />
          <span style={{ fontSize: "14px" }}>{mix.label}</span>
        </div>
      </div>
      <p style={{ maxWidth: "220px", fontSize: "12px", marginTop: "8px" }}>{mix.comment}</p>
    </div>
  );
};

export default EnergyDoughnutChart;
