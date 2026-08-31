import { createRequestId, logger } from "./logger";

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const DEFAULT_WEATHER_LOCATION = {
  latitude: 28.6139,
  longitude: 77.209,
  label: "Delhi (default)",
  source: "default",
};

export const getCurrentCoordinates = () => new Promise((resolve, reject) => {
  logger.info("geolocation_request_started");
  if (!window.isSecureContext) {
    logger.warn("geolocation_request_failed", { reason: "insecure_context" });
    reject({ reason: "insecure_context" });
    return;
  }
  if (!("geolocation" in navigator)) {
    logger.warn("geolocation_request_failed", { reason: "unsupported" });
    reject({ reason: "unsupported" });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      logger.info("geolocation_request_completed");
      resolve({
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: "Current location",
        source: "browser",
      });
    },
    (error) => {
      const reason = error.code === 1
        ? "permission_denied"
        : error.code === 2
          ? "position_unavailable"
          : error.code === 3
            ? "timeout"
            : "unknown";
      logger.warn("geolocation_request_failed", { reason });
      reject(error);
    },
    {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 5 * 60 * 1000,
    },
  );
});

export const describeGeolocationError = (error) => {
  if (error?.reason === "insecure_context") {
    return "Current location requires HTTPS or localhost.";
  }
  if (error?.reason === "unsupported") {
    return "This browser does not support location lookup.";
  }
  if (error?.code === 1) {
    return "Location permission is blocked for this site.";
  }
  if (error?.code === 2) {
    return "Your current position is temporarily unavailable.";
  }
  if (error?.code === 3) {
    return "The current-location lookup timed out.";
  }
  return "The browser could not determine your current location.";
};

const weatherPresentation = (code, isDay) => {
  if (code === 0) return { condition: "Clear", icon: isDay ? "☀️" : "🌙" };
  if (code === 1 || code === 2) return { condition: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { condition: "Fog", icon: "🌫️" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { condition: "Rain", icon: "🌧️" };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { condition: "Snow", icon: "❄️" };
  }
  if (code >= 95) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Current conditions", icon: "🌡️" };
};

export const formatWeatherTime = (isoLocalTime) => {
  const time = isoLocalTime?.split("T")[1]?.slice(0, 5);
  if (!time) return "Unavailable";
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  if (!Number.isInteger(hour)) return "Unavailable";
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
};

export const fetchCurrentWeather = async (
  { latitude, longitude, source = "unknown" },
  { signal } = {},
) => {
  const requestId = createRequestId();
  const startedAt = performance.now();
  let statusCode;
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("daily", "sunrise,sunset");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  logger.info("weather_request_started", {
    requestId,
    provider: "open-meteo",
    locationSource: source,
  });

  try {
    const response = await fetch(url, { signal });
    statusCode = response.status;
    if (!response.ok) throw new Error("Weather provider request failed");
    const data = await response.json();
    const temperature = Number(data.current?.temperature_2m);
    const weatherCode = Number(data.current?.weather_code);
    if (
      !Number.isFinite(temperature) ||
      !Number.isFinite(weatherCode) ||
      !data.daily?.sunrise?.[0] ||
      !data.daily?.sunset?.[0]
    ) {
      throw new Error("Weather provider returned an incomplete response");
    }

    logger.info("weather_request_completed", {
      requestId,
      provider: "open-meteo",
      locationSource: source,
      statusCode,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
    });
    return {
      temperature,
      temperatureUnit: data.current_units?.temperature_2m || "°C",
      ...weatherPresentation(weatherCode, data.current?.is_day === 1),
      sunrise: formatWeatherTime(data.daily.sunrise[0]),
      sunset: formatWeatherTime(data.daily.sunset[0]),
    };
  } catch (error) {
    const fields = {
      requestId,
      provider: "open-meteo",
      locationSource: source,
      statusCode,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      errorName: error.name,
    };
    if (error.name === "AbortError") logger.debug("weather_request_cancelled", fields);
    else if (statusCode && statusCode < 500) logger.warn("weather_request_failed", fields);
    else logger.error("weather_request_failed", fields);
    throw error;
  }
};
