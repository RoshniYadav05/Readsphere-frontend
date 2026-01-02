// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This is the missing 'cn' function that your UI components need.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Your existing slugify function ---
export function slugify(text: string): string {
  if (!text) {
    return '';
  }
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')        // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}