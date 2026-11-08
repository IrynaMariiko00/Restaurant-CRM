import type {
  GuestOrderItems,
  OrderItem,
  OrderItemEmployeeStatus,
  OrderItemFulfillmentStatus,
} from "@/types/order";

export function getFulfillmentStatus(
  item: OrderItem,
): OrderItemFulfillmentStatus {
  if (item.fulfillmentStatus) return item.fulfillmentStatus;

  switch (item.status) {
    case "ORDERED":
      return "ORDERED";
    case "SERVED":
      return "SERVED";
    case "CANCELED":
      return "CANCELED";
    default:
      return "CONFIRMED";
  }
}

export function isItemPaid(item: OrderItem) {
  return (
    item.paymentStatus === "SUCCEEDED" ||
    item.status === "PAID_CASH" ||
    item.status === "PAID_CARD"
  );
}

export function getEmployeeActions(item: OrderItem): OrderItemEmployeeStatus[] {
  const fulfillment = getFulfillmentStatus(item);
  const paid = isItemPaid(item);
  const actions: OrderItemEmployeeStatus[] = [];

  if (fulfillment === "ORDERED") actions.push("CONFIRMED");
  if (fulfillment === "CONFIRMED") actions.push("SERVED");
  if (fulfillment !== "CANCELED" && !paid) actions.push("PAID_CASH");
  if ((fulfillment === "ORDERED" || fulfillment === "CONFIRMED") && !paid) {
    actions.push("CANCELED");
  }

  return actions;
}

export function canGuestEditItem(item: OrderItem) {
  return getFulfillmentStatus(item) === "ORDERED" && !isItemPaid(item);
}

export function getItemTotal(item: OrderItem) {
  return item.itemPriceSnapshot * item.quantity;
}

export function flattenOrderItems(groups: GuestOrderItems[] | null) {
  return (groups ?? []).flatMap((group) => group.orderItems);
}

export function sumOrderItems(items: OrderItem[]) {
  return items.reduce(
    (sum, item) =>
      getFulfillmentStatus(item) === "CANCELED" ? sum : sum + getItemTotal(item),
    0,
  );
}

export function countOrderItems(items: OrderItem[]) {
  return items.reduce(
    (count, item) =>
      getFulfillmentStatus(item) === "CANCELED" ? count : count + item.quantity,
    0,
  );
}

export function formatOrderDateTime(value: string | null, language?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(language, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
