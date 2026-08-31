const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const SENSITIVE_KEY = /(authorization|cookie|password|passwd|secret|token|database_?url|api_?key|credential)/i;
const UUID_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const MAX_DEPTH = 5;
const MAX_STRING_LENGTH = 1_000;

const configuredLevel = Object.hasOwn(LEVELS, import.meta.env.VITE_LOG_LEVEL)
  ? import.meta.env.VITE_LOG_LEVEL
  : "info";

const redactString = (value) => {
  const redacted = value
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer [REDACTED]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED_JWT]")
    .replace(/\b(?:postgres(?:ql)?|mongodb(?:\+srv)?):\/\/[^\s"']+/gi, "[REDACTED_DATABASE_URL]");
  return redacted.length > MAX_STRING_LENGTH
    ? `${redacted.slice(0, MAX_STRING_LENGTH)}…`
    : redacted;
};

const sanitize = (value, depth = 0, seen = new WeakSet()) => {
  if (value === null || value === undefined) return value;
  if (value instanceof Error) {
    return {
      name: value.name,
      code: typeof value.code === "string" ? value.code : undefined,
    };
  }
  if (typeof value === "string") return redactString(value);
  if (["number", "boolean"].includes(typeof value)) return value;
  if (typeof value !== "object") return String(value);
  if (depth >= MAX_DEPTH) return "[MAX_DEPTH]";
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => sanitize(item, depth + 1, seen));
  }

  const result = {};
  for (const [key, nestedValue] of Object.entries(value).slice(0, 50)) {
    result[key] = SENSITIVE_KEY.test(key)
      ? "[REDACTED]"
      : sanitize(nestedValue, depth + 1, seen);
  }
  return result;
};

const write = (level, event, fields = {}) => {
  if (LEVELS[level] < LEVELS[configuredLevel]) return;
  const record = {
    ...sanitize(fields),
    timestamp: new Date().toISOString(),
    level,
    service: "illuminate-frontend",
    environment: import.meta.env.MODE,
    event,
  };
  const method = level === "debug" ? "debug" : level;
  console[method](JSON.stringify(record));
};

export const logger = {
  debug: (event, fields) => write("debug", event, fields),
  info: (event, fields) => write("info", event, fields),
  warn: (event, fields) => write("warn", event, fields),
  error: (event, fields) => write("error", event, fields),
};

export const createRequestId = () => globalThis.crypto?.randomUUID?.()
  || `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const normalizePath = (value = "") => {
  let path = String(value).split(/[?#]/, 1)[0];
  try {
    path = new URL(value, window.location.origin).pathname;
  } catch {
    // Keep the already query-free relative value.
  }
  return path.replace(UUID_PATTERN, ":id");
};

const safeErrorFields = (error) => ({
  errorName: error?.name || error?.constructor?.name || "UnknownError",
  errorCode: typeof error?.code === "string" ? error.code : undefined,
});

export const installGlobalErrorLogging = () => {
  const installKey = "__illuminateGlobalErrorLoggingInstalled";
  if (window[installKey]) return;
  window[installKey] = true;

  window.addEventListener("error", (event) => {
    logger.error("window_error", {
      ...safeErrorFields(event.error),
      source: normalizePath(event.filename || window.location.pathname),
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("unhandled_promise_rejection", safeErrorFields(event.reason));
  });
};

export { redactString, sanitize };
