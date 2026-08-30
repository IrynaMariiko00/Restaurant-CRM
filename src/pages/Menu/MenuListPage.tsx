import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MenuDishCard } from "./components/MenuDishCard";
import { useMenuBrowse } from "./hooks/useMenuBrowse";
import { useMenuList } from "./hooks/useMenuList";

export const MenuListPage = () => {
  const { t } = useTranslation();
  const { itemTo, homeTo } = useMenuBrowse();
  const { items, meta, page, isLoading, error, setPage } = useMenuList();

  const totalPages =
    meta && meta.size > 0 ? Math.ceil(meta.total / meta.size) : 0;

  return (
    <main className="menu-page">
      <Link to={homeTo} className="menu-page__back">
        <ArrowLeft className="menu-page__back-icon" aria-hidden />
        {t("staff.back_to_home")}
      </Link>

      <div className="menu-page__inner">
        <aside className="menu-page__rail">
          <p className="menu-page__brand">{t("menu.brand")}</p>
          <h1 className="menu-page__title">{t("admin.menu_title")}</h1>
          <p className="menu-page__lead">{t("menu.list_subtitle")}</p>
        </aside>

        <section className="menu-page__stage" aria-live="polite">
          {isLoading ? (
            <div className="menu-page__status">
              <Loader2
                className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
                aria-label={t("common.waiting")}
              />
            </div>
          ) : error ? (
            <p className="menu-page__status menu-page__status--error">
              {t(error)}
            </p>
          ) : items.length === 0 ? (
            <p className="menu-page__empty">{t("menu.empty")}</p>
          ) : (
            <div className="menu-grid">
              {items.map((item) => (
                <MenuDishCard key={item.id} item={item} to={itemTo(item.id)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="menu-pager">
              <button
                type="button"
                className="menu-pager__btn"
                disabled={page <= 0}
                onClick={() => setPage(page - 1)}
              >
                {t("menu.page_prev")}
              </button>
              <p className="menu-pager__status">
                {t("menu.page_status", { page: page + 1, pages: totalPages })}
              </p>
              <button
                type="button"
                className="menu-pager__btn"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t("menu.page_next")}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
