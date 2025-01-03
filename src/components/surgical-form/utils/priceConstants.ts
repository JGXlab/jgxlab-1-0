// This file is kept for backwards compatibility
// Prices are now fetched dynamically from the service_prices table
export const STRIPE_PRODUCT_IDS = {
  'surgical-day': '',
  'printed-try-in': '',
  'nightguard': '',
  'direct-load-pmma': '',
  'direct-load-zirconia': '',
  'ti-bar': ''
} as const;

export const BASE_PRICES = {
  'surgical-day': 2500,
  'printed-try-in': 1500,
  'nightguard': 500,
  'direct-load-pmma': 2000,
  'direct-load-zirconia': 2000,
  'ti-bar': 3000
} as const;