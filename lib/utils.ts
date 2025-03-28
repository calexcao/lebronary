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
