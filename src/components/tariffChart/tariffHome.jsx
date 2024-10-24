import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns'; // For time-based scales
import jsonData from '../../utils/solar_tariff_data.json';
import './tariffChart.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const TariffHome = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  // Convert the jsonData into Date objects for filtering and graphing
  const prepareData = () => {
    return jsonData.map((entry) => {
      // Convert date and time strings to a format that can be parsed by Date
      const formattedDate = entry.date.split('-').reverse().join('-'); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
      const formattedTime = entry.time.replace(/-/g, ':'); // Convert 'HH-MM-SS' to 'HH:MM:SS'
      
      // Create a new Date object
      return {
        date: new Date(`${formattedDate}T${formattedTime}`), // Use T for ISO format
        tariff_rate: entry.tariff_rate
      };
    });
  };
  console.log(jsonData[0]);

  // Filter the data based on the selected time range
  const filterData = (data) => {
    // const now = new Date();
    let filtered = data.filter((item) => item.date >= new Date("Sun Oct 20 2024 00:00:00 GMT+0530 (India Standard Time)"));
    console.log(filtered);

    return filtered;
  };

  // Prepare the data for chart.js format
  const getChartData = () => {
    return {
      labels: filteredData.map(item => item.date),
      datasets: [{
        label: 'Tariff Rate (INR/kWh)',
        data: filteredData.map(item => item.tariff_rate),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 1,
      }],
    };
  };

  const handleTariffHome = () => {
    navigate('/analytics');
  }

  useEffect(() => {
    const data = prepareData();
    setFilteredData(filterData(data));
  }, [timeRange]);

  return (
    <div style={{maxHeight:"200px"}} className='tariff-home p-4' onClick={handleTariffHome}>
      <h2>Tariff Rate (Today)</h2>

      {/* Line chart showing tariff rates */}
      <Line
        data={getChartData()}
        options={{
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour', // Change to 'day' for week/month
              },
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Tariff Rate (INR/kWh)'
              }
            }
          },
          plugins: {
            legend: {
              display: true
            }
          },
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};

export default TariffHome;
