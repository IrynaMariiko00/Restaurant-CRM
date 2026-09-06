import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/types/menuItem";
import { SuccessCheckmark } from "@/ui/SuccessCheckmark";
import type { MenuItemEditorMode } from "../hooks/menuItemForm";

type MenuItemEditorSuccessProps = {
  mode: MenuItemEditorMode;
  item: MenuItem;
  onCreateAnother?: () => void;
};

export function MenuItemEditorSuccess({
  mode,
  item,
  onCreateAnother,
}: MenuItemEditorSuccessProps) {
  const { t } = useTranslation();
  const isEdit = mode === "edit";

  return (
    <div className="menu-studio__success">
      <SuccessCheckmark className="mb-4" />
      <h1 className="menu-studio__success-title">
        {t(isEdit ? "menu.edit_success_title" : "menu.create_success_title")}
      </h1>
      <p className="menu-studio__success-lead">
        {t(isEdit ? "menu.edit_success_lead" : "menu.create_success_lead", {
          name:
            item.nameDefaultLanguage ||
            item.nameSecondLanguage ||
            t("menu.untitled"),
        })}
      </p>
      <div className="menu-studio__success-actions">
        <Link to={`/staff/menu/${item.id}`} className="btn-accent">
          {t("menu.create_view_item")}
        </Link>
        {isEdit ? (
          <Link to="/staff/menu" className="btn-ghost">
            {t("menu.back_to_menu")}
          </Link>
        ) : (
          onCreateAnother && (
            <button
              type="button"
              className="btn-ghost"
              onClick={onCreateAnother}
            >
              {t("menu.create_another")}
            </button>
          )
        )}
      </div>
    </div>
  );
}
