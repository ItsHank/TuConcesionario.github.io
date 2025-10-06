import type { PriceRange } from "@shared/schema";

export type VIPLevel = "NONE" | "PLATINO" | "ORO" | "DIAMANTE";

export interface VIPDiscount {
  level: VIPLevel;
  label: string;
  discountRange: string;
}

export const VIP_LEVELS: VIPDiscount[] = [
  { level: "NONE", label: "Sin VIP", discountRange: "0%" },
  { level: "PLATINO", label: "VIP Platino", discountRange: "10-12%" },
  { level: "ORO", label: "VIP Oro", discountRange: "13-15%" },
  { level: "DIAMANTE", label: "VIP Diamante", discountRange: "15-20%" },
];

export function calculateVIPDiscount(
  originalPrice: number,
  priceRange: PriceRange,
  vipLevel: VIPLevel
): { discountedPrice: number; discountPercentage: number } {
  if (vipLevel === "NONE") {
    return { discountedPrice: originalPrice, discountPercentage: 0 };
  }

  let discountPercentage = 0;

  switch (vipLevel) {
    case "DIAMANTE":
      if (priceRange === "Alto") {
        discountPercentage = 20;
      } else if (priceRange === "Medio") {
        discountPercentage = 17.5;
      } else {
        discountPercentage = 15;
      }
      break;
    case "ORO":
      if (priceRange === "Alto") {
        discountPercentage = 15;
      } else if (priceRange === "Medio") {
        discountPercentage = 14;
      } else {
        discountPercentage = 13;
      }
      break;
    case "PLATINO":
      if (priceRange === "Alto") {
        discountPercentage = 12;
      } else if (priceRange === "Medio") {
        discountPercentage = 11;
      } else {
        discountPercentage = 10;
      }
      break;
  }

  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
  
  return { 
    discountedPrice: Math.round(discountedPrice), 
    discountPercentage 
  };
}
