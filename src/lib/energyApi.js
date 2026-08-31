import apiRequest from "./apiRequest";

let optimizationPromise = null;
const configuredOptimizationTimeout = Number(import.meta.env.VITE_ML_REQUEST_TIMEOUT_MS);
const optimizationTimeoutMs = Number.isFinite(configuredOptimizationTimeout)
  && configuredOptimizationTimeout > 0
  ? configuredOptimizationTimeout
  : 65_000;

const ensureOptimization = async () => {
  if (!optimizationPromise) {
    optimizationPromise = apiRequest
      .post("/ml/optimize", undefined, { timeout: optimizationTimeoutMs })
      .finally(() => {
        optimizationPromise = null;
      });
  }
  return optimizationPromise;
};

export const getEnergyData = async (path) => {
  try {
    return (await apiRequest.get(path)).data;
  } catch (error) {
    if (
      error.response?.status !== 404 ||
      error.response?.data?.error !== "ENERGY_DATA_NOT_FOUND"
    ) {
      throw error;
    }

    await ensureOptimization();
    return (await apiRequest.get(path)).data;
  }
};

export const refreshEnergyData = async () => {
  const response = await ensureOptimization();
  return response.data;
};
