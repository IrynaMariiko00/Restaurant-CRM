import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { OrderItemActionsMenu } from "@/shared/orders/OrderItemActionsMenu";
import { OrderItemStatusBadge } from "@/shared/orders/OrderItemStatusBadge";
import {
  canGuestEditItem,
  flattenOrderItems,
  getItemTotal,
  sumOrderItems,
} from "@/shared/orders/orderItems";
import { useOrderMoney } from "@/shared/orders/useOrderMoney";
import type { OrderItem } from "@/types/order";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { PageLoader } from "@/ui/PageLoader";
import { useGuestOrder } from "./hooks/useGuestOrder";

export const GuestOrderPage = () => {
  const { t } = useTranslation();
  const { tableId } = useParams<{ tableId: string }>();
  const formatMoney = useOrderMoney();
  const { current, isLoading, loadError, isEmpty, busyItemId, updateItem } =
    useGuestOrder();
  const [removeTarget, setRemoveTarget] = useState<OrderItem | null>(null);
  const [editTarget, setEditTarget] = useState<OrderItem | null>(null);
  const [editComment, setEditComment] = useState("");
  const [quantityTarget, setQuantityTarget] = useState<OrderItem | null>(null);
  const [quantityValue, setQuantityValue] = useState(1);

  const confirmQuantity = async () => {
    if (!quantityTarget) return;
    if (quantityValue !== quantityTarget.quantity) {
      await updateItem(quantityTarget.id, { quantity: quantityValue });
    }
    setQuantityTarget(null);
  };

  const confirmEditComment = async () => {
    if (!editTarget) return;
    await updateItem(editTarget.id, { clientComment: editComment.trim() });
    setEditTarget(null);
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    await updateItem(removeTarget.id, { isCancelled: true });
    setRemoveTarget(null);
  };

  const menuTo = `/table/${tableId}/menu`;
  const homeTo = `/table/${tableId}`;

  const header = (
    <header className="guest-order__header">
      <Link to={homeTo} className="guest-order__back">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("orders.guest_back")}
      </Link>
      <h1 className="guest-order__title">{t("orders.guest_title")}</h1>
    </header>
  );

  if (isLoading) {
    return (
      <main className="guest-order">
        {header}
        <PageLoader />
      </main>
    );
  }

  if (!current) {
    return (
      <main className="guest-order">
        {header}
        {loadError && !isEmpty ? (
          <p className="text-center text-sm text-[var(--error-color)]">{loadError}</p>
        ) : (
          <p className="tables-page__empty">{t("orders.guest_empty")}</p>
        )}
        <Link to={menuTo} className="btn-accent guest-order__cta">
          {t("orders.guest_open_menu")}
        </Link>
      </main>
    );
  }

  const myId = current.thisGuestId;
  const groups = current.order.orderItemsByGuests ?? [];
  const mine = flattenOrderItems(groups.filter((group) => group.guestId === myId));
  const others = groups.filter((group) => group.guestId !== myId);
  const tableTotal = sumOrderItems(flattenOrderItems(groups));
  const myTotal = sumOrderItems(mine);

  const renderItem = (item: OrderItem, editable: boolean) => {
    const canEdit = editable && canGuestEditItem(item);

    return (
      <li key={item.id} className="guest-order__item">
        <div className="guest-order__item-head">
          <div className="guest-order__item-main">
            <div className="guest-order__item-title">
              <Link
                to={`/table/${tableId}/menu/${item.menuItemId}`}
                className="order-item__name order-item__link"
              >
                {item.itemNameSnapshot}
              </Link>
              <OrderItemStatusBadge item={item} />
            </div>
            {item.clientComment && (
              <p className="order-item__note">{item.clientComment}</p>
            )}
          </div>
          {canEdit && (
            <OrderItemActionsMenu
              hasComment={Boolean(item.clientComment)}
              onEditQuantity={() => {
                setQuantityValue(item.quantity);
                setQuantityTarget(item);
              }}
              onEditComment={() => {
                setEditComment(item.clientComment ?? "");
                setEditTarget(item);
              }}
              onRemove={() => setRemoveTarget(item)}
            />
          )}
        </div>

        <div className="guest-order__item-foot">
          <p className="guest-order__item-price">
            {formatMoney(getItemTotal(item), item.currency)}
          </p>
          <span className="guest-order__item-qty">×{item.quantity}</span>
        </div>
      </li>
    );
  };

  return (
    <main className="guest-order">
      {header}

      <section className="order-guest">
        <h2 className="order-guest__title">{t("orders.guest_mine")}</h2>
        {mine.length === 0 ? (
          <p className="tables-page__empty">{t("orders.guest_mine_empty")}</p>
        ) : (
          <ul className="order-items">{mine.map((item) => renderItem(item, true))}</ul>
        )}
      </section>

      {others.map((group) => (
        <section key={group.guestId} className="order-guest order-guest--other">
          <h2 className="order-guest__title">
            {t("orders.guest_other", { id: group.guestId })}
          </h2>
          <ul className="order-items">
            {group.orderItems.map((item) => renderItem(item, false))}
          </ul>
        </section>
      ))}

      <div className="order-summary">
        <div>
          <p className="order-summary__label">{t("orders.guest_my_total")}</p>
          <p className="order-summary__total">{formatMoney(myTotal)}</p>
          {others.length > 0 && (
            <p className="order-summary__meta">
              {t("orders.guest_table_total", { total: formatMoney(tableTotal) })}
            </p>
          )}
        </div>
        <Link to={menuTo} className="btn-accent">
          {t("orders.guest_add_more")}
        </Link>
      </div>

      <ConfirmDialog
        open={quantityTarget != null}
        title={t("orders.guest_edit_quantity_title")}
        align="center"
        description={
          <div className="order-item__qty guest-order__qty-dialog">
            <button
              type="button"
              className="order-qty-btn"
              disabled={quantityValue <= 1}
              aria-label={t("orders.qty_decrease")}
              onClick={() => setQuantityValue((value) => value - 1)}
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="order-qty-value">{quantityValue}</span>
            <button
              type="button"
              className="order-qty-btn"
              aria-label={t("orders.qty_increase")}
              onClick={() => setQuantityValue((value) => value + 1)}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        }
        confirmLabel={t("orders.guest_edit_comment_confirm")}
        cancelLabel={t("common.cancel")}
        isLoading={quantityTarget != null && busyItemId === quantityTarget.id}
        onConfirm={() => {
          void confirmQuantity();
        }}
        onCancel={() => setQuantityTarget(null)}
      />

      <ConfirmDialog
        open={editTarget != null}
        title={t("orders.guest_edit_comment_title")}
        description={
          <div className="form-field">
            <label htmlFor="guest-edit-comment" className="form-label">
              {t("orders.guest_comment_label")}
            </label>
            <textarea
              id="guest-edit-comment"
              className="form-input menu-studio__textarea"
              rows={3}
              value={editComment}
              placeholder={t("orders.guest_comment_placeholder")}
              onChange={(event) => setEditComment(event.target.value)}
            />
          </div>
        }
        confirmLabel={t("orders.guest_edit_comment_confirm")}
        cancelLabel={t("common.cancel")}
        isLoading={editTarget != null && busyItemId === editTarget.id}
        onConfirm={() => {
          void confirmEditComment();
        }}
        onCancel={() => setEditTarget(null)}
      />

      <ConfirmDialog
        open={removeTarget != null}
        title={t("orders.guest_remove_title")}
        description={
          <p>
            {t("orders.guest_remove_lead", {
              name: removeTarget?.itemNameSnapshot ?? "",
            })}
          </p>
        }
        confirmLabel={t("orders.guest_remove_confirm")}
        cancelLabel={t("orders.keep_item")}
        tone="danger"
        isLoading={removeTarget != null && busyItemId === removeTarget.id}
        onConfirm={() => {
          void confirmRemove();
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </main>
  );
};
