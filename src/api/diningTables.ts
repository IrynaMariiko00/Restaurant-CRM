import type {
  DiningTableGetParams,
  DiningTableListParams,
  DiningTableListResponse,
  DiningTableResponse,
} from "@/types/diningTable";
import { api } from "./api";

export const diningTablesApi = {
  getDiningTable: async (
    id: number,
    params?: DiningTableGetParams,
  ): Promise<DiningTableResponse> => {
    const response = await api.get(`/dining-tables/${id}`, { params });
    return response.data;
  },

  updateDiningTableActivity: async (
    id: number,
    isActive: boolean,
  ): Promise<DiningTableResponse> => {
    const response = await api.put(`/dining-tables/${id}`, null, {
      params: { isActive },
    });
    return response.data;
  },

  getDiningTables: async (
    params?: DiningTableListParams,
  ): Promise<DiningTableListResponse> => {
    const response = await api.get("/dining-tables", { params });
    return response.data;
  },

  createDiningTable: async (): Promise<DiningTableResponse> => {
    const response = await api.post("/dining-tables");
    return response.data;
  },

  getDiningTableQrCode: async (uuid: string): Promise<Blob> => {
    if (!uuid.trim()) {
      throw new Error("Invalid dining table QR uuid");
    }

    const response = await api.get(`/dining-tables/qr/${uuid}`, {
      responseType: "blob",
    });

    if (response.status !== 200 || !(response.data instanceof Blob)) {
      throw new Error("Dining table QR code not found");
    }

    if (response.data.type.includes("application/json")) {
      throw new Error("Dining table QR code not found");
    }

    return response.data;
  },

  getGuestDiningTable: async (uuid: string): Promise<DiningTableResponse> => {
    const response = await api.get("/dining-tables/guest", {
      params: { uuid },
    });
    return response.data;
  },
};
