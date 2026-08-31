import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import {
  DEFAULT_WEATHER_LOCATION,
  describeGeolocationError,
  fetchCurrentWeather,
  getCurrentCoordinates,
} from "../../lib/weatherService";

const validSavedLocation = (settings) => {
  const latitude = Number(settings?.latitude);
  const longitude = Number(settings?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return {
    latitude,
    longitude,
    label: settings.location || "Saved location",
    source: "settings",
  };
};

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadWeather = async () => {
      setLoading(true);
      setError("");
      setNotice("");

      const settingsPromise = apiRequest
        .get("/settings", { signal: controller.signal })
        .then(({ data }) => validSavedLocation(data))
        .catch(() => null);

      let browserLocation = null;
      let geolocationError = null;
      try {
        browserLocation = await getCurrentCoordinates();
      } catch (locationError) {
        geolocationError = locationError;
      }

      const savedLocation = await settingsPromise;
      const candidates = [browserLocation, savedLocation, DEFAULT_WEATHER_LOCATION]
        .filter(Boolean)
        .filter((candidate, index, locations) => locations.findIndex((location) => (
          location.latitude === candidate.latitude &&
          location.longitude === candidate.longitude
        )) === index);

      let weatherError = null;
      for (const candidate of candidates) {
        try {
          const currentWeather = await fetchCurrentWeather(candidate, {
            signal: controller.signal,
          });
          if (!active) return;
          setWeather({ ...currentWeather, location: candidate.label });

          if (candidate.source !== "browser") {
            const locationMessage = geolocationError
              ? describeGeolocationError(geolocationError)
              : "Weather for the current coordinates was unavailable.";
            setNotice(`${locationMessage} Showing ${candidate.label}.`);
          }
          setLoading(false);
          return;
        } catch (fetchError) {
          if (fetchError.name === "AbortError") return;
          weatherError = fetchError;
        }
      }

      if (!active) return;
      setWeather(null);
      setError(weatherError?.message || "Unable to load weather data");
      setLoading(false);
    };

    void loadWeather();
    return () => {
      active = false;
      controller.abort();
    };
  }, [retryVersion]);

  if (loading) return <div>Loading weather…</div>;

  if (error) {
    return (
      <div className="weather-container flex flex-col gap-3">
        <div>{error}</div>
        <button type="button" onClick={() => setRetryVersion((value) => value + 1)}>
          Retry weather
        </button>
      </div>
    );
  }

  if (!weather) return <div>No weather data available.</div>;

  return (
    <div className="weather-container flex flex-col gap-4">
      <div className="weather-header font-bold">Current Weather</div>
      <div className="flex gap-4 items-center">
        <div className="location">{weather.location}</div>
        <div className="temperature">
          {Math.round(weather.temperature)}{weather.temperatureUnit}
        </div>
        <div className="weather-icon" title={weather.condition} aria-label={weather.condition}>
          {weather.icon}
        </div>
      </div>
      <div className="sunrise-sunset">
        <div>🌅 Sunrise: {weather.sunrise}</div>
        <div>🌇 Sunset: {weather.sunset}</div>
      </div>
      {notice && (
        <div className="text-xs text-gray-500">
          <span>{notice}</span>{" "}
          <button
            className="underline"
            type="button"
            onClick={() => setRetryVersion((value) => value + 1)}
          >
            Retry current location
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
