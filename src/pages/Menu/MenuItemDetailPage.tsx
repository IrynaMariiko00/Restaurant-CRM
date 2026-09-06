import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { menuItemsApi } from "@/api/menuItems";
import { useAuth } from "@/context/AuthContext";
import { formatMenuPrice, getMenuItemCopy } from "@/shared/menu/itemCopy";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { MenuDishFlags } from "./components/MenuDishFlags";
import { MenuDishImage } from "./components/MenuDishImage";
import { useMenuBrowse } from "./hooks/useMenuBrowse";
import { useMenuItemDetail } from "./hooks/useMenuItemDetail";

export const MenuItemDetailPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { listTo, variant } = useMenuBrowse();
  const { item, isLoading, error } = useMenuItemDetail();
  const canManage = variant === "staff" && isAdmin;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setDeleteOpen(false);
    setDeleteError(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!item) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await menuItemsApi.deleteMenuItem(item.id);
      if (!response.success) {
        setDeleteError(
          response.errors?.[0] ??
            response.message ??
            t("menu.delete_error"),
        );
        return;
      }
      setDeleteOpen(false);
      navigate(listTo, { replace: true });
    } catch {
      setDeleteError(t("menu.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  }, [item, listTo, navigate, t]);

  const backLink = (
    <Link to={listTo} className="menu-page__back">
      <ArrowLeft className="menu-page__back-icon" aria-hidden />
      {t("menu.back_to_menu")}
    </Link>
  );

  if (isLoading || error || !item) {
    return (
      <main className="menu-detail menu-detail--plain">
        {backLink}
        {isLoading ? (
          <Loader2
            className="mx-auto mt-16 h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        ) : (
          <p className="menu-page__status menu-page__status--error">
            {t(error ?? "menu.item_load_error")}
          </p>
        )}
      </main>
    );
  }

  const copy = getMenuItemCopy(item, i18n.resolvedLanguage ?? i18n.language);
  const name = copy.name || t("menu.untitled");

  return (
    <main className="menu-detail">
      {backLink}
      <div className="menu-detail__media">
        <MenuDishImage
          imageId={item.imageId}
          alt={name}
          className="menu-detail__photo"
        />
      </div>

      <div className="menu-detail__copy">
        <p className="menu-detail__price">{formatMenuPrice(item.price)}</p>
        <h1 className="menu-detail__title">{name}</h1>
        <MenuDishFlags item={item} />

        {copy.description && (
          <p className="menu-detail__lead">{copy.description}</p>
        )}

        {copy.ingredients.length > 0 && (
          <section className="menu-detail__block">
            <h2>{t("menu.ingredients")}</h2>
            <p>{copy.ingredients.join(", ")}</p>
          </section>
        )}

        <dl className="menu-detail__meta">
          {item.weightGrams != null && item.weightGrams > 0 && (
            <div>
              <dt>{t("menu.weight")}</dt>
              <dd>{t("menu.weight_g", { grams: item.weightGrams })}</dd>
            </div>
          )}
          {item.maxQuantityPerPerson != null &&
            item.maxQuantityPerPerson > 0 && (
              <div>
                <dt>{t("menu.max_quantity")}</dt>
                <dd>{item.maxQuantityPerPerson}</dd>
              </div>
            )}
        </dl>

        {canManage && (
          <div className="menu-detail__actions">
            <Link
              to={`/staff/menu/${item.id}/edit`}
              className="btn-accent menu-detail__edit"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              {t("menu.edit_cta")}
            </Link>
            <button
              type="button"
              className="btn-danger menu-detail__delete"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              {t("menu.delete_cta")}
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title={t("menu.delete_confirm_title")}
        description={
          <>
            <p>
              {t("menu.delete_confirm_lead", {
                name,
              })}
            </p>
            {deleteError && (
              <p className="confirm-dialog__error">{deleteError}</p>
            )}
          </>
        }
        confirmLabel={t("menu.delete_confirm")}
        cancelLabel={t("common.cancel")}
        tone="danger"
        isLoading={isDeleting}
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={closeDeleteDialog}
      />
    </main>
  );
};
