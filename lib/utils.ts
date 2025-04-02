import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageSize = 10;

export function formatISBN(isbn: string) {
  const cleanISBN = isbn.replace(/\D/g, "");

  if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
    return null;
  }

  if (cleanISBN.length === 10) {
    return cleanISBN.replace(
      /(\d{1})(\d{3})(\d{1})(\d{3})(\d{1})(\d{1})/,
      "$1-$2-$3-$4-$5-$6"
    );
  }

  if (cleanISBN.length === 13) {
    return cleanISBN.replace(
      /(\d{3})(\d{1})(\d{1})(\d{1})(\d{5})(\d{1})(\d{1})/,
      "$1-$2-$3-$4-$5-$6-$7"
    );
  }

  return "INVALID";
}

export type ReturnType = {
  time: string;
  display: string;
};

export function getTimeSlots(
  startTime = "08:00",
  endTime = "18:00"
): ReturnType[] {
  const timeArray: ReturnType[] = [];
  const parsedStartTime: Date = new Date(`2000-01-01T${startTime}:00`);
  const parsedEndTime: Date = new Date(`2000-01-01T${endTime}:00`);

  const currentTime: Date = parsedStartTime;
  while (currentTime <= parsedEndTime) {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const ampm = currentTime.getHours() < 12 ? "AM" : "PM";
    const timeString = `${hours}:${minutes} ${ampm}`;
    timeArray.push({
      time: `${hours}:${minutes}`,
      display: timeString,
    });

    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return timeArray;
}

//https://medium.com/@sungbinkim98
export const getDateWithOffset = (date: Date) => {
  if (typeof date === "string") {
    const datePart = (date as string).split("T")[0];
    const formatDate = new Date(
      new Date(datePart).getTime() + new Date().getTimezoneOffset() * 60000
    );
    return formatDate;
  }
  const dt = new Date();
  return new Date(date.getTime() + dt.getTimezoneOffset() * 60000);
};

export function formatAmount(amount: number, currency: string): string {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const formatAmount = numberFormat.format(amount);
  return formatAmount === "$NaN" ? "" : formatAmount;
}
