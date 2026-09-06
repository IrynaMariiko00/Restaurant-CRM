import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { menuItemsApi } from "@/api/menuItems";
import { useAuth } from "@/context/AuthContext";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import { getMenuItemCopy } from "@/shared/menu/itemCopy";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { MenuCategoryTabs } from "./components/MenuCategoryTabs";
import { MenuDishCard } from "./components/MenuDishCard";
import { useMenuBrowse } from "./hooks/useMenuBrowse";
import { useMenuCatalog } from "./hooks/useMenuCatalog";
import { useMenuScrollSpy } from "./hooks/useMenuScrollSpy";

export const MenuListPage = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const { variant, itemTo, homeTo } = useMenuBrowse();
  const { sections, totalItems, isLoading, error, removeItem } =
    useMenuCatalog();
  const showManage = variant === "staff" && isAdmin;
  const sectionIds = sections.map((section) => section.category.id);
  const {
    activeId,
    tabsRef,
    setSectionRef,
    setTabButtonRef,
    scrollToCategory,
  } = useMenuScrollSpy({ sectionIds });

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await menuItemsApi.deleteMenuItem(deleteTarget.id);
      if (!response.success) {
        setDeleteError(
          response.errors?.[0] ??
            response.message ??
            t("menu.delete_error"),
        );
        return;
      }
      removeItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteError(t("menu.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, removeItem, t]);

  return (
    <main className="menu-page">
      <Link to={homeTo} className="menu-page__back">
        <ArrowLeft className="menu-page__back-icon" aria-hidden />
        {t("staff.back_to_home")}
      </Link>

      <div className="menu-page__inner">
        <div className="menu-page__sidebar">
          <aside className="menu-page__rail">
            <p className="menu-page__brand">{t("menu.brand")}</p>
            <h1 className="menu-page__title">{t("admin.menu_title")}</h1>
            <p className="menu-page__lead">{t("menu.list_subtitle")}</p>
            {showManage && (
              <Link
                to="/staff/menu/new"
                className="btn-accent menu-page__create"
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t("menu.create_cta")}
              </Link>
            )}
          </aside>

          {!isLoading && !error && totalItems > 0 && (
            <MenuCategoryTabs
              sections={sections}
              activeId={activeId}
              tabsRef={tabsRef}
              setTabButtonRef={setTabButtonRef}
              onSelect={scrollToCategory}
            />
          )}
        </div>

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
          ) : totalItems === 0 ? (
            <p className="menu-page__empty">{t("menu.empty")}</p>
          ) : (
            <div className="menu-sections">
              {sections.map((section) => {
                const title =
                  getCategoryLabel(
                    section.category,
                    i18n.resolvedLanguage ?? i18n.language,
                  ) || t("menu.untitled");
                const parentLabel = section.parent
                  ? getCategoryLabel(
                      section.parent,
                      i18n.resolvedLanguage ?? i18n.language,
                    )
                  : "";

                return (
                  <section
                    key={section.category.id}
                    ref={(node) => setSectionRef(section.category.id, node)}
                    data-category-id={section.category.id}
                    className="menu-section"
                    aria-labelledby={`menu-section-${section.category.id}`}
                  >
                    <header className="menu-section__header">
                      {parentLabel && (
                        <p className="menu-section__parent">{parentLabel}</p>
                      )}
                      <h2
                        id={`menu-section-${section.category.id}`}
                        className="menu-section__title"
                      >
                        {title}
                      </h2>
                    </header>
                    <div className="menu-grid">
                      {section.items.map((item) => (
                        <MenuDishCard
                          key={item.id}
                          item={item}
                          to={itemTo(item.id)}
                          editTo={
                            showManage
                              ? `/staff/menu/${item.id}/edit`
                              : undefined
                          }
                          onDelete={
                            showManage
                              ? () =>
                                  setDeleteTarget({
                                    id: item.id,
                                    name:
                                      getMenuItemCopy(
                                        item,
                                        i18n.resolvedLanguage ?? i18n.language,
                                      ).name || t("menu.untitled"),
                                  })
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={deleteTarget != null}
        title={t("menu.delete_confirm_title")}
        description={
          <>
            <p>
              {t("menu.delete_confirm_lead", {
                name: deleteTarget?.name ?? "",
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
