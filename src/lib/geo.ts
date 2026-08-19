export type CountryCode = "IN" | "US" | "GB" | "CA" | "AE" | "AU";

export type Pricing = {
  currency: string;
  symbol: string;
  monthly: string;
  yearly: string;
  free: string;
};

export const PRICING: Record<string, Pricing> = {
  IN: { currency: "INR", symbol: "₹", monthly: "₹299", yearly: "₹2,499", free: "₹0" },
  US: { currency: "USD", symbol: "$", monthly: "$14.99", yearly: "$119.99", free: "$0" },
  GB: { currency: "GBP", symbol: "£", monthly: "£12.99", yearly: "£104.99", free: "£0" },
  CA: { currency: "CAD", symbol: "C$", monthly: "C$19.99", yearly: "C$159.99", free: "C$0" },
  AE: { currency: "AED", symbol: "AED", monthly: "AED 54.99", yearly: "AED 449", free: "AED 0" },
  AU: { currency: "AUD", symbol: "A$", monthly: "A$21.99", yearly: "A$174.99", free: "A$0" },
};

export const DEFAULT_PRICING: Pricing = PRICING.US;

export function pricingFor(countryCode?: string | null): Pricing {
  if (!countryCode) return DEFAULT_PRICING;
  return PRICING[countryCode.toUpperCase()] ?? DEFAULT_PRICING;
}

export type ClimateLocation = {
  countryCode: string;
  countryName: string;
  city?: string | null;
  region?: string | null;
  timezone?: string | null;
  source: "header" | "ip-api" | "fallback";
};
