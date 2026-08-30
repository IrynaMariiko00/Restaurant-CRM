import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatMenuPrice, getMenuItemCopy } from "@/shared/menu/itemCopy";
import { MenuDishFlags } from "./components/MenuDishFlags";
import { MenuDishImage } from "./components/MenuDishImage";
import { useMenuBrowse } from "./hooks/useMenuBrowse";
import { useMenuItemDetail } from "./hooks/useMenuItemDetail";

export const MenuItemDetailPage = () => {
  const { t } = useTranslation();
  const { listTo } = useMenuBrowse();
  const { item, isLoading, error } = useMenuItemDetail();

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

  const copy = getMenuItemCopy(item);
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
      </div>
    </main>
  );
};
