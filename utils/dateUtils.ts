export const adjustDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const adjustedStart = new Date(start);
  adjustedStart.setDate(
    start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1)
  );

  const adjustedEnd = new Date(end);
  adjustedEnd.setDate(
    end.getDate() + (end.getDay() === 0 ? 0 : 7 - end.getDay())
  );

  return { adjustedStart, adjustedEnd };
};
