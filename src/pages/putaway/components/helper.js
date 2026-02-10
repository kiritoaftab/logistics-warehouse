export function matchDateOption(option, dateString) {
  const inputDate = new Date(dateString);
  const now = new Date();

  // Normalize times (start of day)
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfInputDay = new Date(inputDate.setHours(0, 0, 0, 0));

  switch (option) {
    case "Today":
      return startOfInputDay.getTime() === startOfToday.getTime();

    case "Yesterday": {
      const yesterday = new Date(startOfToday);
      yesterday.setDate(yesterday.getDate() - 1);
      return startOfInputDay.getTime() === yesterday.getTime();
    }

    case "Last 7 Days": {
      const sevenDaysAgo = new Date(startOfToday);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      return inputDate >= sevenDaysAgo && inputDate <= new Date();
    }

    case "This Month":
      return (
        inputDate.getMonth() === new Date().getMonth() &&
        inputDate.getFullYear() === new Date().getFullYear()
      );

    case "All":
      return true;

    default:
      return false;
  }
}
