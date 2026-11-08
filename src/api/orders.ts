import type {
  AddOrderItemEmployeeRequest,
  AddOrderItemRequest,
  CloseOrderManuallyRequest,
  GuestCurrentOrderResponse,
  OrderHistoryParams,
  OrderItemsByGuestsResponse,
  OrderListParams,
  OrderListResponse,
  OrderPaymentListResponse,
  OrderResponse,
  ReassignOrderEmployeeRequest,
  UpdateOrderItemEmployeeRequest,
  UpdateOrderItemRequest,
} from "@/types/order";
import { api } from "./api";

export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}

export const ordersApi = {
  getOrders: async (params?: OrderListParams): Promise<OrderListResponse> => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  getOrder: async (id: number): Promise<OrderResponse> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getOrderHistory: async (
    params?: OrderHistoryParams,
  ): Promise<OrderListResponse> => {
    const response = await api.get("/orders/history", { params });
    return response.data;
  },

  getOrderPayments: async (
    id: number,
    params?: OrderListParams,
  ): Promise<OrderPaymentListResponse> => {
    const response = await api.get(`/orders/${id}/payments`, { params });
    return response.data;
  },

  closeOrder: async (id: number): Promise<OrderResponse> => {
    const response = await api.put(`/orders/${id}/close`);
    return response.data;
  },

  closeOrderManually: async (
    id: number,
    data: CloseOrderManuallyRequest,
  ): Promise<OrderResponse> => {
    const response = await api.put(`/orders/${id}/close-manually`, data);
    return response.data;
  },

  addOrderItem: async (
    orderId: number,
    data: AddOrderItemEmployeeRequest,
  ): Promise<OrderItemsByGuestsResponse> => {
    const response = await api.post(`/orders/${orderId}/items`, data);
    return response.data;
  },

  updateOrderItem: async (
    itemId: number,
    data: UpdateOrderItemEmployeeRequest,
  ): Promise<OrderItemsByGuestsResponse> => {
    const response = await api.put(`/orders/items/${itemId}`, data);
    return response.data;
  },

  reassignOrderEmployee: async (
    orderId: number,
    data: ReassignOrderEmployeeRequest,
  ): Promise<OrderResponse> => {
    const response = await api.put(`/orders/${orderId}/employee`, data);
    return response.data;
  },

  getGuestCurrentOrder: async (): Promise<GuestCurrentOrderResponse> => {
    const response = await api.get("/orders/guest/current");
    return response.data;
  },

  addGuestOrderItem: async (
    data: AddOrderItemRequest,
    idempotencyKey: string = createIdempotencyKey(),
  ): Promise<GuestCurrentOrderResponse> => {
    const response = await api.post("/orders/guest/items", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return response.data;
  },

  updateGuestOrderItem: async (
    itemId: number,
    data: UpdateOrderItemRequest,
  ): Promise<GuestCurrentOrderResponse> => {
    const response = await api.put(`/orders/guest/items/${itemId}`, {
      isCancelled: false,
      ...data,
    });
    return response.data;
  },
};
