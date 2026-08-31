const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const localDayNumber = (date) => Date.UTC(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
) / 86_400_000;

const formatTime = (date) => new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
}).format(date);

const formatNotificationTimestamp = (value, now = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const dayDifference = localDayNumber(now) - localDayNumber(date);
  const time = formatTime(date);
  if (dayDifference === 0) return `Today, ${time}`;
  if (dayDifference === 1) return `Yesterday, ${time}`;

  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getMonth()]}, ${time}`;
};

export default formatNotificationTimestamp;
