import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type MenuDishCardMenuProps = {
  editTo: string;
  onDelete: () => void;
};

export function MenuDishCardMenu({ editTo, onDelete }: MenuDishCardMenuProps) {
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
    <div ref={rootRef} className="menu-dish-menu">
      <button
        type="button"
        className="menu-dish-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("menu.card_actions")}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div id={menuId} className="menu-dish-menu__dropdown" role="menu">
          <Link
            to={editTo}
            role="menuitem"
            className="menu-dish-menu__item"
            onClick={(event) => event.stopPropagation()}
          >
            <Pencil className="h-4 w-4" aria-hidden />
            {t("menu.edit_cta")}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="menu-dish-menu__item menu-dish-menu__item--danger"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t("menu.delete_cta")}
          </button>
        </div>
      )}
    </div>
  );
}
