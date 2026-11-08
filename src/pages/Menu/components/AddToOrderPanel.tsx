import { Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createIdempotencyKey, ordersApi } from "@/api/orders";
import { useFeedback } from "@/context/useFeedback";
import type { MenuItem } from "@/types/menuItem";

type AddToOrderPanelProps = {
  item: MenuItem;
};

export function AddToOrderPanel({ item }: AddToOrderPanelProps) {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptRef = useRef<{ signature: string; key: string } | null>(null);

  const maxQuantity =
    item.maxQuantityPerPerson != null && item.maxQuantityPerPerson > 0
      ? item.maxQuantityPerPerson
      : 99;

  const unavailable = item.isAvailable === false;

  const submit = async () => {
    const body = {
      menuItemId: item.id,
      quantity,
      ...(comment.trim() ? { clientComment: comment.trim() } : {}),
    };
    const signature = JSON.stringify(body);

    if (attemptRef.current?.signature !== signature) {
      attemptRef.current = { signature, key: createIdempotencyKey() };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await ordersApi.addGuestOrderItem(
        body,
        attemptRef.current.key,
      );

      if (!response.success) {
        setError(response.errors?.[0] ?? t("orders.guest_add_error"));
        return;
      }

      attemptRef.current = null;
      setQuantity(1);
      setComment("");
      feedback.success(t("orders.guest_add_success"));
    } catch {
      setError(t("orders.guest_add_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="add-to-order">
      <div className="add-to-order__row">
        <div className="order-item__qty">
          <button
            type="button"
            className="order-qty-btn"
            disabled={isSubmitting || quantity <= 1}
            aria-label={t("orders.qty_decrease")}
            onClick={() => setQuantity((value) => value - 1)}
          >
            <Minus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <span className="order-qty-value">{quantity}</span>
          <button
            type="button"
            className="order-qty-btn"
            disabled={isSubmitting || quantity >= maxQuantity}
            aria-label={t("orders.qty_increase")}
            onClick={() => setQuantity((value) => value + 1)}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>

        <button
          type="button"
          className="btn-accent add-to-order__submit"
          disabled={isSubmitting || unavailable}
          onClick={() => void submit()}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ShoppingBag className="h-4 w-4" aria-hidden />
          )}
          {unavailable ? t("orders.guest_unavailable") : t("guest.add_to_order")}
        </button>
      </div>

      <div className="form-field">
        <label htmlFor="guest-order-comment" className="form-label">
          {t("orders.guest_comment_label")}
        </label>
        <textarea
          id="guest-order-comment"
          className="form-input menu-studio__textarea"
          rows={2}
          value={comment}
          disabled={isSubmitting}
          placeholder={t("orders.guest_comment_placeholder")}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      {error && <p className="menu-studio__error">{error}</p>}
    </section>
  );
}
