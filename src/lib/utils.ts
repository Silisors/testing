import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(
    amount: number,
    currency: string = "USD",
    locale: string = "en-US"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

export function formatDate(
    date: Date | string,
    locale: string = "en-US",
    options?: Intl.DateTimeFormatOptions
): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
    }).format(d);
}

export function formatRelativeTime(date: Date | string, locale: string = "en-US"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
    }
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
}

export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

export function generateId(prefix: string = ""): string {
    const id = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${id}` : id;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
