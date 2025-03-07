import { clsx, type ClassValue } from "clsx";
import { ClientResponse } from "hono/client";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catSeries<T>(
  items: T[],
  catBy: keyof T | ((item: T) => unknown),
) {
  const groups: T[][] = [];
  let group: T[] = [];

  items.forEach((item) => {
    if (group.length === 0) {
      group.push(item);
      return;
    }

    const prev = group[group.length - 1];
    const prevKey = typeof catBy === "function" ? catBy(prev) : prev[catBy];
    const key = typeof catBy === "function" ? catBy(item) : item[catBy];

    if (prevKey === key) {
      group.push(item);
      return;
    }

    groups.push(group);
    group = [item];
  });

  if (group.length > 0) {
    groups.push(group);
  }

  return groups;
}

export async function getErrorMessage(
  res: ClientResponse<Object, number, "json">,
): Promise<string> {
  const data = await res.json();

  if ("error" in data && typeof data.error === "string") {
    return data.error;
  }

  return "Something went wrong";
}

export async function showErrorToast(
  res: ClientResponse<Object, number, "json">,
) {
  toast.error(await getErrorMessage(res));
}

const romanMap = new Map([
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
]);

declare global {
  interface Number {
    toRoman: () => string;
  }
}

Number.prototype.toRoman = function (): string {
  let romanized = "";
  let num = this as number;

  romanMap.forEach((roman, key) => {
    const q = (num / key) | 0;
    if (q > 0) {
      romanized += roman.repeat(q);
      num -= key * q;
    }
  });

  return romanized;
};
