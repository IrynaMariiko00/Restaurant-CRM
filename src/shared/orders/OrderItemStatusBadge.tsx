import { useTranslation } from "react-i18next";
import type { OrderItem } from "@/types/order";
import { getFulfillmentStatus, isItemPaid } from "./orderItems";

type OrderItemStatusBadgeProps = {
  item: OrderItem;
};

export function OrderItemStatusBadge({ item }: OrderItemStatusBadgeProps) {
  const { t } = useTranslation();
  const fulfillment = getFulfillmentStatus(item);
  const paid = isItemPaid(item);
  const paymentPending = item.paymentStatus === "PENDING";
  const refund = item.refundStatus;

  return (
    <span className="order-badges">
      <span
        className={`order-badge order-badge--${fulfillment.toLowerCase()}`}
      >
        {t(`orders.fulfillment.${fulfillment}`)}
      </span>
      {paid && (
        <span className="order-badge order-badge--paid">
          {t(
            item.status === "PAID_CASH"
              ? "orders.payment.paid_cash"
              : "orders.payment.paid",
          )}
        </span>
      )}
      {paymentPending && (
        <span className="order-badge order-badge--pending">
          {t("orders.payment.pending")}
        </span>
      )}
      {refund && (
        <span className="order-badge order-badge--refund">
          {t(`orders.refund.${refund}`)}
        </span>
      )}
    </span>
  );
}
