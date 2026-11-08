import type { BaseResponse } from "./auth";

export type OrderStatus = "OPENED" | "CLOSED";

export type OrderItemStatus =
  | "ORDERED"
  | "CONFIRMED"
  | "CANCELED"
  | "SERVED"
  | "PAID_CASH"
  | "PAID_CARD";

export type OrderItemEmployeeStatus =
  | "CONFIRMED"
  | "CANCELED"
  | "SERVED"
  | "PAID_CASH";

export type OrderItemFulfillmentStatus =
  | "ORDERED"
  | "CONFIRMED"
  | "SERVED"
  | "CANCELED";

export type OrderItemPaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "EXPIRED";

export type OrderItemRefundStatus =
  | "REQUESTED"
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "UNKNOWN";

export type OrderCurrency = "UAH" | "EUR";

export interface OrderItem {
  id: number;
  guestId: number;
  orderId: number;
  menuItemId: number;
  itemNameSnapshot: string;
  itemPriceSnapshot: number;
  quantity: number;
  status: OrderItemStatus;
  clientComment: string | null;
  employeeComment: string | null;
  fulfillmentStatus?: OrderItemFulfillmentStatus;
  paymentStatus?: OrderItemPaymentStatus | null;
  refundStatus?: OrderItemRefundStatus | null;
  currency?: OrderCurrency | null;
}

export interface GuestOrderItems {
  guestId: number;
  orderItems: OrderItem[];
}

export interface Order {
  id: number;
  uuid: string;
  orderStatus: OrderStatus;
  diningTableId: number;
  employeeId: number;
  createdAt: string;
  closedAt: string | null;
  orderItemsByGuests: GuestOrderItems[] | null;
}

export interface GuestCurrentOrder {
  thisGuestId: number;
  order: Order;
}

export interface OrderPageMeta {
  page: number;
  size: number;
  total: number;
}

export interface OrderListData {
  items: Order[];
  meta: OrderPageMeta;
}

export type OrderPayment = Record<string, unknown>;

export interface OrderPaymentListData {
  items: OrderPayment[];
  meta: OrderPageMeta;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface OrderHistoryParams extends OrderListParams {
  status?: OrderStatus;
  from?: string;
  to?: string;
}

export interface AddOrderItemRequest {
  menuItemId: number;
  quantity: number;
  clientComment?: string;
}

export interface AddOrderItemEmployeeRequest {
  guestId?: number;
  menuItemId: number;
  quantity: number;
  employeeComment?: string;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  isCancelled?: boolean;
  clientComment?: string;
}

export interface UpdateOrderItemEmployeeRequest {
  quantity?: number;
  orderItemStatusDto?: OrderItemEmployeeStatus;
  employeeComment?: string;
}

export interface CloseOrderManuallyRequest {
  markUnpaidAs: "PAID_CASH" | "CANCELED";
  employeeComment?: string;
}

export interface ReassignOrderEmployeeRequest {
  employeeId: number;
}

export type OrderResponse = BaseResponse<Order>;
export type OrderListResponse = BaseResponse<OrderListData>;
export type GuestCurrentOrderResponse = BaseResponse<GuestCurrentOrder>;
export type OrderItemsByGuestsResponse = BaseResponse<GuestOrderItems[]>;
export type OrderPaymentListResponse = BaseResponse<OrderPaymentListData>;
