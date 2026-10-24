import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { PageLoader } from "@/ui/PageLoader";
import { CategoryEditorActions } from "./components/CategoryEditorPanel";
import {
  ChildrenWorkspace,
  ParentSectionsNav,
} from "./components/CategoryListPanel";
import {
  categoryDraftKey,
  useMenuCategoriesAdmin,
} from "./hooks/useMenuCategoriesAdmin";

export function CategoriesManagementPage() {
  const { i18n } = useTranslation();
  const {
    parents,
    children,
    selectedParentId,
    selectParent,
    isLoadingParents,
    isLoadingChildren,
    loadError,
    drafts,
    editor,
    form,
    setField,
    formError,
    isSaving,
    canSubmit,
    hasDrafts,
    openCreateParent,
    openCreateChild,
    openEdit,
    closeEditor,
    saveEditor,
    deleteTarget,
    isDeleting,
    deleteError,
    openDelete,
    closeDelete,
    confirmDelete,
    t,
  } = useMenuCategoriesAdmin();

  const selectedParent = parents.find((item) => item.id === selectedParentId);
  const selectedParentDraft =
    selectedParentId != null
      ? drafts[categoryDraftKey("parent", "edit", selectedParentId)]
      : undefined;
  const selectedParentName = selectedParent
    ? getCategoryLabel(
        selectedParentDraft
          ? {
              ...selectedParent,
              nameDefaultLanguage:
                selectedParentDraft.form.nameDefaultLanguage,
              nameSecondLanguage:
                selectedParentDraft.form.nameSecondLanguage,
            }
          : selectedParent,
        i18n.resolvedLanguage ?? i18n.language,
      ) || t("menu.untitled")
    : null;

  const editorControls = {
    drafts,
    editor,
    form,
    formError,
    setField,
    onSave: () => void saveEditor(),
  };

  return (
    <AdminPageShell
      title={t("admin.categories_title")}
      subtitle={t("admin.categories_desc")}
    >
      <div className="categories-page">
        <Link to="/staff/menu" className="categories-page__back">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("menu.back_to_menu")}
        </Link>

        {isLoadingParents && parents.length === 0 ? (
          <PageLoader />
        ) : loadError ? (
          <p className="text-center text-sm text-[var(--error-color)]">
            {loadError}
          </p>
        ) : (
          <div className="categories-page__shell">
            <div className="categories-page__layout">
              <ParentSectionsNav
                items={parents}
                selectedId={selectedParentId}
                isLoading={isLoadingParents}
                editorControls={editorControls}
                onCreate={openCreateParent}
                onSelect={selectParent}
                onEdit={(id) => openEdit("parent", id)}
                onDelete={(id, name) => openDelete("parent", id, name)}
              />

              <ChildrenWorkspace
                parentName={selectedParentName}
                items={children}
                isLoading={isLoadingChildren}
                editorControls={editorControls}
                onCreate={openCreateChild}
                onEdit={(id) => openEdit("child", id)}
                onDelete={(id, name) => openDelete("child", id, name)}
              />
            </div>

            {hasDrafts && (
              <CategoryEditorActions
                isSaving={isSaving}
                canSubmit={canSubmit}
                onCancel={closeEditor}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget != null}
        title={
          deleteTarget?.kind === "parent"
            ? t("admin.categories_delete_parent_title")
            : t("admin.categories_delete_child_title")
        }
        description={
          <>
            <p>
              {t(
                deleteTarget?.kind === "parent"
                  ? "admin.categories_delete_parent_lead"
                  : "admin.categories_delete_child_lead",
                { name: deleteTarget?.name ?? "" },
              )}
            </p>
            {deleteError && (
              <p className="mt-2 text-sm text-[var(--error-color)]">
                {deleteError}
              </p>
            )}
          </>
        }
        confirmLabel={t("admin.categories_delete_confirm")}
        cancelLabel={t("common.cancel")}
        tone="danger"
        isLoading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={closeDelete}
      />
    </AdminPageShell>
  );
}
