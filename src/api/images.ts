import { api } from "./api";

export const imagesApi = {
  getImage: async (id: number): Promise<Blob> => {
    if (!id || id <= 0) {
      throw new Error("Invalid image id");
    }

    const response = await api.get(`/images/${id}`, {
      responseType: "blob",
    });

    if (response.status !== 200 || !(response.data instanceof Blob)) {
      throw new Error("Image not found");
    }

    if (response.data.type.includes("application/json")) {
      throw new Error("Image not found");
    }

    return response.data;
  },
};
