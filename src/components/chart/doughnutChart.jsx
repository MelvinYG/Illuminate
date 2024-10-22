import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const EnergyDoughnutChart = () => {
  // Define the data for the doughnut chart
  const data = {
    labels: ['Solar', 'Grid', 'Battery', 'Other'],
    datasets: [
      {
        label: 'Energy Source',
        data: [61, 25, 10, 4], // These values represent the % for each source
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800'], // Colors corresponding to each label
        hoverOffset: 4, // Slight effect when hovering over each segment
        borderWidth: 0,  // To remove the border between segments
      },
    ],
  };

  const options = {
    cutout: '70%',  // This makes it a doughnut chart by creating a hole in the middle
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,  // Hide the legend to match the look of the provided image
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '200px', height: '200px' }}>
      <Doughnut data={data} options={options} />
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          textAlign: 'center'
      }}>
        <span>61%</span>
        <br />
        <span style={{ fontSize: '14px' }}>Self Powered</span>
      </div>
    </div>
  );
};

export default EnergyDoughnutChart;
