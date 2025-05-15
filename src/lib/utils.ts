
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Brand color constants
export const BRAND_COLORS = {
  primary: '#1B677D', // dark cyan
  secondary: '#90B7C2', // light blue
}
