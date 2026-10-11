import type {
  RestaurantResponse,
  RestaurantUpdateParams,
} from "@/types/restaurant";
import { api } from "./api";

export const restaurantApi = {
  getRestaurant: async (): Promise<RestaurantResponse> => {
    const response = await api.get("/restaurant/this");
    return response.data;
  },

  updateRestaurant: async (
    params: RestaurantUpdateParams,
    files?: {
      logo?: File | null;
      backgroundImage?: File | null;
    },
  ): Promise<RestaurantResponse> => {
    const formData = new FormData();
    if (files?.logo) formData.append("logo", files.logo);
    if (files?.backgroundImage) {
      formData.append("backgroundImage", files.backgroundImage);
    }

    const response = await api.put("/restaurant/this", formData, { params });
    return response.data;
  },
};
