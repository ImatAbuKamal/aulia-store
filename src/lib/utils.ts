import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number) {
  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
}

export function escapeHTML(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeInput(str: string | null | undefined): string {
  if (!str) return "";
  let clean = str.replace(/<[^>]*>/g, "");
  clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
  return clean;
}
