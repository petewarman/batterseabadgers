const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const getOrdinalSuffix = i => {
  const j = i % 10;
  const k = i % 100;

  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};

// format docs - duplicate moment
// https://momentjs.com/docs/#/displaying/
const patterns = {
  // long month (January)
  MMMM: dateObj => monthNames[dateObj.getMonth()],

  // short month (Jan)
  MMM: dateObj => monthNames[dateObj.getMonth()].slice(0, 3),

  // day of month (1st 2nd ... 30th 31st)
  Do: dateObj => getOrdinalSuffix(dateObj.getDate()),

  // long day (Monday)
  dddd: dateObj => dayNames[dateObj.getDay()],

  // short day (Mon)
  ddd: dateObj => dayNames[dateObj.getDay()].slice(0, 3),

  // year (2019)
  YYYY: dateObj => dateObj.getFullYear()
};

export default (dateString, format) => {
  const dateObj = new Date(dateString);

  return Object.keys(patterns).reduce((acc, pattern) => {
    if (!acc.includes(pattern)) {
      return acc;
    }

    return acc.split(pattern).join(patterns[pattern](dateObj));
  }, format);
};
