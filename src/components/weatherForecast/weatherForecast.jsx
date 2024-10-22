import { useEffect, useState } from "react";
// import axios from "axios";
import weatherData from "../../lib/sampleWeather.json";

import AcUnitIcon from "@mui/icons-material/AcUnit";

// Utility function to convert UNIX timestamp to readable time
const convertUnixToTime = (unixTime, timezone) => {
  const date = new Date((unixTime + timezone) * 1000); // Adjust for the location's timezone
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const WeatherIcons = {
  sunny: "☀️",
  cloudy: "☁️",
  partiallyCloudy: "⛅",
  rainy: "🌧️",
  thunderstorm: "⛈️",
  snow: "❄️",
};

const WeatherIcon = ({ condition }) => {
  switch (condition) {
    case "Clear":
      return <span>{WeatherIcons.sunny}</span>;
    case "Clouds":
      return <span>{WeatherIcons.cloudy}</span>;
    case "Partly Cloudy":
      return <span>{WeatherIcons.partiallyCloudy}</span>;
    case "Rain":
      return <span>{WeatherIcons.rainy}</span>;
    case "Thunderstorm":
      return <span>{WeatherIcons.thunderstorm}</span>;
    case "Snow":
      return <span>{WeatherIcons.snow}</span>;
    default:
      return <span>🌡️</span>; // Default icon for unknown weather
  }
};

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const apikey = "7241807c6eab85d2733659ad558ee3b4";

  useEffect(() => {
    // Fetch current location using geolocation API
    const fetchLocationWeather = async (lat, lon) => {
      try {
        // const response = await axios.get(
        //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
        // );
        const response = weatherData;
        // setWeather(response.data);
        setWeather(response);
        setLoading(false);
        // console.log(response.data);
      } catch (error) {
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };

    // Geolocation API: Request current location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchLocationWeather(latitude, longitude);
          },
          (error) => {
            setError("Geolocation access denied");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!weather) {
    return <div>No weather data available.</div>;
  }

  const weatherCondition = weather.weather[0].main;
  const sunriseTime = convertUnixToTime(weather.sys.sunrise, weather.timezone);
  const sunsetTime = convertUnixToTime(weather.sys.sunset, weather.timezone);

  return (
    <div className="weather-container flex flex-col gap-4">
      <div className="weather-header font-bold">Current Weather</div>
      <div className="flex gap-4">
        <div className="location">{weather.name}</div>
        <div className="temperature">{Math.round(weather.main.temp)}°C</div>
        <div className="weather-icon">
            <WeatherIcon condition={weatherCondition} />
        </div>
      </div>
      <div className="sunrise-sunset">
        <div>🌅 Sunrise: {sunriseTime}</div>
        <div>🌇 Sunset: {sunsetTime}</div>
      </div>
    </div>
  );
};

export default WeatherForecast;
