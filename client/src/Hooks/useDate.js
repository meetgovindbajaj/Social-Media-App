const useDate = (date) => {
  const timeDiff = new Date() - new Date(date);
  const secDiff = Math.round(timeDiff / 1000);
  const minDiff = Math.round(timeDiff / 60000);
  const hourDiff = Math.round(timeDiff / 3600000);
  const dayDiff = Math.round(timeDiff / 86400000);
  const weekDiff = Math.round(timeDiff / 604800000);
  const monthDiff = Math.round(timeDiff / 2.628e9);
  const yearDiff = Math.round(timeDiff / 3.154e10);
  const timeline = {
    s: secDiff,
    m: minDiff,
    h: hourDiff,
    d: dayDiff,
    w: weekDiff,
    mo: monthDiff,
    y: yearDiff,
    string:
      secDiff < 60
        ? `${secDiff}s ago`
        : minDiff < 60
        ? `${minDiff}m ago`
        : hourDiff < 24
        ? `${hourDiff}h ago`
        : dayDiff < 7
        ? `${dayDiff}d ago`
        : weekDiff < 52
        ? `${weekDiff}w ago`
        : `${yearDiff}y ago`,
  };
  return timeline;
};
export default useDate;
