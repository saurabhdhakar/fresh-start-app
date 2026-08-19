import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { ClimateLocation } from "./geo";

const NAMES: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AE: "United Arab Emirates",
  AU: "Australia",
};

export const detectClimateLocation = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClimateLocation> => {
    let headers: Record<string, string> = {};
    try {
      headers = Object.fromEntries(
        Object.entries(getRequestHeaders() ?? {}).map(([k, v]) => [k.toLowerCase(), String(v ?? "")]),
      );
    } catch {
      headers = {};
    }

    const headerCountry = headers["cf-ipcountry"] || headers["x-vercel-ip-country"] || "";
    if (headerCountry && headerCountry !== "XX" && headerCountry !== "T1") {
      const code = headerCountry.toUpperCase();
      return {
        countryCode: code,
        countryName: NAMES[code] ?? code,
        city: headers["cf-ipcity"] || headers["x-vercel-ip-city"] || null,
        region: null,
        timezone: headers["cf-timezone"] || null,
        source: "header",
      };
    }

    const forwarded = headers["cf-connecting-ip"] || (headers["x-forwarded-for"] ?? "").split(",")[0]?.trim();
    try {
      const url = forwarded
        ? `http://ip-api.com/json/${encodeURIComponent(forwarded)}?fields=status,country,countryCode,city,regionName,timezone`
        : "http://ip-api.com/json/?fields=status,country,countryCode,city,regionName,timezone";
      const res = await fetch(url);
      const data = (await res.json()) as {
        status?: string;
        country?: string;
        countryCode?: string;
        city?: string;
        regionName?: string;
        timezone?: string;
      };
      if (data.status === "success" && data.countryCode) {
        return {
          countryCode: data.countryCode.toUpperCase(),
          countryName: data.country ?? data.countryCode,
          city: data.city ?? null,
          region: data.regionName ?? null,
          timezone: data.timezone ?? null,
          source: "ip-api",
        };
      }
    } catch {
      // ignore and fall through
    }

    return { countryCode: "IN", countryName: "India", city: null, region: null, timezone: null, source: "fallback" };
  },
);
