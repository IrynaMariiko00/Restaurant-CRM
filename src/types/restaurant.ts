import type { BaseResponse } from "./auth";

export type RestaurantRegion = "EUROPE" | "UKRAINE";

export interface Restaurant {
  id: number;
  name: string;
  logoId: number | null;
  backgroundImageId: number | null;
  defaultRegion: RestaurantRegion;
  language: string;
  currency: string;
  paymentProvider: string;
}

export type RestaurantUpdateParams = {
  name?: string;
  defaultRegion?: RestaurantRegion;
};

export type RestaurantResponse = BaseResponse<Restaurant>;
