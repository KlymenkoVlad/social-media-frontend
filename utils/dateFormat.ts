import dayjs from "dayjs";

export const dateFormat = (date: Date): string => {
  const postDate = dayjs(date);
  const currentDate = dayjs();

  const isToday = postDate.isSame(currentDate, "day");
  const isSameWeek = postDate.isSame(currentDate, "week");

  return isToday
    ? `Today, ${postDate.format("HH:mm")}`
    : isSameWeek
      ? `${postDate.format("dddd, HH:mm")}`
      : postDate.format("DD.MM.YYYY");
};
