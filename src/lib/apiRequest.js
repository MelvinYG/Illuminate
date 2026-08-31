import axios from "axios";
import { createRequestId, logger, normalizePath } from "./logger";

const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/",
    withCredentials: true,
    timeout: 30000,
});

const requestDetails = (config) => ({
    method: (config.method || "GET").toUpperCase(),
    path: normalizePath(config.url || ""),
});

apiRequest.interceptors.request.use((config) => {
    const requestId = createRequestId();
    config.headers.set("X-Request-ID", requestId);
    config.telemetry = {
        requestId,
        startedAt: performance.now(),
    };
    logger.info("api_request_started", {
        ...requestDetails(config),
        requestId,
    });
    return config;
}, (error) => {
    logger.error("api_request_setup_failed", {
        errorName: error?.name || "AxiosError",
        errorCode: error?.code,
    });
    return Promise.reject(error);
});

apiRequest.interceptors.response.use((response) => {
    const telemetry = response.config.telemetry || {};
    logger.info("api_request_completed", {
        ...requestDetails(response.config),
        requestId: response.headers?.["x-request-id"] || telemetry.requestId,
        statusCode: response.status,
        durationMs: telemetry.startedAt === undefined
            ? undefined
            : Number((performance.now() - telemetry.startedAt).toFixed(2)),
    });
    return response;
}, (error) => {
    const config = error.config || {};
    const telemetry = config.telemetry || {};
    const statusCode = error.response?.status;
    const fields = {
        ...requestDetails(config),
        requestId: error.response?.headers?.["x-request-id"] || telemetry.requestId,
        statusCode,
        durationMs: telemetry.startedAt === undefined
            ? undefined
            : Number((performance.now() - telemetry.startedAt).toFixed(2)),
        errorCode: error.code,
    };

    if (error.code === "ERR_CANCELED") logger.debug("api_request_cancelled", fields);
    else if (statusCode && statusCode < 500) logger.warn("api_request_failed", fields);
    else logger.error("api_request_failed", fields);
    return Promise.reject(error);
});

export default apiRequest;
