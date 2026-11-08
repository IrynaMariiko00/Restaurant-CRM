import { Hash, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type OrderItemActionsMenuProps = {
  hasComment: boolean;
  onEditQuantity: () => void;
  onEditComment: () => void;
  onRemove: () => void;
};

export function OrderItemActionsMenu({
  hasComment,
  onEditQuantity,
  onEditComment,
  onRemove,
}: OrderItemActionsMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`menu-dish-menu${open ? " menu-dish-menu--open" : ""}`}
    >
      <button
        type="button"
        className="menu-dish-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("orders.item_actions")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div id={menuId} className="menu-dish-menu__dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            className="menu-dish-menu__item"
            onClick={() => {
              setOpen(false);
              onEditQuantity();
            }}
          >
            <Hash className="h-4 w-4" aria-hidden />
            {t("orders.guest_edit_quantity")}
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu-dish-menu__item"
            onClick={() => {
              setOpen(false);
              onEditComment();
            }}
          >
            <MessageSquare className="h-4 w-4" aria-hidden />
            {t(
              hasComment
                ? "orders.guest_edit_comment"
                : "orders.guest_add_comment",
            )}
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu-dish-menu__item menu-dish-menu__item--danger"
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t("orders.guest_cancel_item")}
          </button>
        </div>
      )}
    </div>
  );
}
