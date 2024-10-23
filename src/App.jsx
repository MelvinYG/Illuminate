import NavBar from "./components/navBar/navBar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from "./components/homePage/homePage";
import DevicesPage from "./components/devicesPage/devicesPage";

const App = () => {
  
  return (
    <Router>
      <NavBar />
      <div className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/analysis" element={<Analysis />} /> 
          <Route path="/notifications" element={<Notifications />} /> */}
          <Route path="/devices" element={<DevicesPage />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// import React, { useEffect, useState } from 'react';
// import './App.css';
// import { io } from 'socket.io-client';

// function App() {
//   const [weatherData, setWeatherData] = useState({
//     temperature: '',
//     humidity: '',
//     windSpeed: '',
//     forecast: '',
//   });

//   useEffect(() => {
//     // Connect to Socket.IO server
//     const socket = io('http://localhost:3001');

//     // Listen for weather updates from the server
//     socket.on('weatherUpdate', (data) => {
//       setWeatherData(data);
//     });

//     // Cleanup the socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div className="App">
//       <h1>Real-Time Weather Updates (Socket.IO)</h1>
//       <div className="weather-info">
//         <p><strong>Temperature:</strong> {weatherData.temperature} °C</p>
//         <p><strong>Humidity:</strong> {weatherData.humidity} %</p>
//         <p><strong>Wind Speed:</strong> {weatherData.windSpeed} m/s</p>
//         <p><strong>Forecast:</strong> {weatherData.forecast}</p>
//       </div>
//     </div>
//   );
// }

// export default App;
