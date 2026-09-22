import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import { MenuItemEditorForm } from "./components/MenuItemEditorForm";
import { MenuItemEditorSuccess } from "./components/MenuItemEditorSuccess";
import { MenuItemLivePreview } from "./components/MenuItemLivePreview";
import { useMenuCategories } from "./hooks/useMenuCategories";
import { useMenuItemEditor } from "./hooks/useMenuItemEditor";
import type { MenuItemEditorMode } from "./hooks/menuItemForm";

type MenuItemEditorPageProps = {
  mode?: MenuItemEditorMode;
};

export function MenuItemEditorPage({
  mode = "create",
}: MenuItemEditorPageProps) {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const itemId =
    mode === "edit" && params.id && Number.isFinite(Number(params.id))
      ? Number(params.id)
      : undefined;

  const {
    form,
    setField,
    imagePreviewUrl,
    handleImageChange,
    fieldErrors,
    submitError,
    isSubmitting,
    isLoadingItem,
    loadError,
    savedItem,
    handleSubmit,
    resetForm,
  } = useMenuItemEditor({ mode, itemId });

  const {
    parents,
    children,
    parentId,
    selectParent,
    hydrateFromChildId,
    isLoadingParents,
    isLoadingChildren,
    error: categoriesError,
  } = useMenuCategories();

  useEffect(() => {
    if (
      mode !== "edit" ||
      form.childCategoryId == null ||
      isLoadingParents ||
      parents.length === 0
    ) {
      return;
    }
    if (parentId != null) return;
    void hydrateFromChildId(form.childCategoryId);
  }, [
    mode,
    form.childCategoryId,
    isLoadingParents,
    parents,
    parentId,
    hydrateFromChildId,
  ]);

  const selectedChild = children.find((c) => c.id === form.childCategoryId);
  const categoryLabel = selectedChild
    ? getCategoryLabel(selectedChild, i18n.resolvedLanguage ?? i18n.language)
    : null;

  if (savedItem) {
    return (
      <main className="menu-studio">
        <Link to="/staff/menu" className="menu-page__back menu-page__back--inline">
          <ArrowLeft className="menu-page__back-icon" aria-hidden />
          {t("menu.back_to_menu")}
        </Link>
        <MenuItemEditorSuccess
          mode={mode}
          item={savedItem}
          onCreateAnother={mode === "create" ? resetForm : undefined}
        />
      </main>
    );
  }

  if (mode === "edit" && (isLoadingItem || loadError)) {
    return (
      <main className="menu-studio">
        <Link to="/staff/menu" className="menu-page__back menu-page__back--inline">
          <ArrowLeft className="menu-page__back-icon" aria-hidden />
          {t("menu.back_to_menu")}
        </Link>
        <div className="menu-studio__status">
          {isLoadingItem ? (
            <Loader2
              className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
              aria-label={t("common.waiting")}
            />
          ) : (
            <p className="menu-studio__error menu-studio__error--banner">
              {t(loadError ?? "menu.item_load_error")}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="menu-studio">
      <Link to="/staff/menu" className="menu-page__back menu-page__back--inline">
        <ArrowLeft className="menu-page__back-icon" aria-hidden />
        {t("menu.back_to_menu")}
      </Link>

      <div className="menu-studio__inner">
        <aside className="menu-studio__rail">
          <p className="menu-page__brand">{t("menu.brand")}</p>
          <h1 className="menu-page__title">
            {t(mode === "edit" ? "menu.edit_title" : "menu.create_title")}
          </h1>
          <p className="menu-page__lead">
            {t(
              mode === "edit" ? "menu.edit_subtitle" : "menu.create_subtitle",
            )}
          </p>
          <div className="menu-studio__preview-wrap">
            <p className="menu-studio__preview-label">
              {t("menu.create_live_preview")}
            </p>
            <MenuItemLivePreview
              form={form}
              imagePreviewUrl={imagePreviewUrl}
              categoryLabel={categoryLabel}
            />
          </div>
        </aside>

        <MenuItemEditorForm
          mode={mode}
          form={form}
          fieldErrors={fieldErrors}
          submitError={submitError}
          isSubmitting={isSubmitting}
          imagePreviewUrl={imagePreviewUrl}
          parents={parents}
          children={children}
          parentId={parentId}
          isLoadingParents={isLoadingParents}
          isLoadingChildren={isLoadingChildren}
          categoriesError={categoriesError}
          selectParent={selectParent}
          setField={setField}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
