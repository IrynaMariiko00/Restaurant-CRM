import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import type { MenuCategory } from "@/types/menuCategory";
import type {
  CategoryDraft,
  CategoryEditorState,
  CategoryFormValues,
  CategoryKind,
} from "../hooks/useMenuCategoriesAdmin";
import { categoryDraftKey } from "../hooks/useMenuCategoriesAdmin";
import { CategoryEditorPanel } from "./CategoryEditorPanel";

export type CategoryEditorControls = {
  drafts: Record<string, CategoryDraft>;
  editor: CategoryEditorState | null;
  form: CategoryFormValues;
  formError: string | null;
  setField: <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K],
  ) => void;
  onSave: () => void;
};

function isEditorOpenFor(
  editor: CategoryEditorState | null,
  kind: CategoryKind,
  mode: "create" | "edit",
  id?: number,
) {
  if (!editor || editor.kind !== kind || editor.mode !== mode) return false;
  if (mode === "create") return true;
  return editor.id === id;
}

function labelFor(
  item: MenuCategory,
  drafts: Record<string, CategoryDraft>,
  kind: CategoryKind,
  language: string,
  fallback: string,
) {
  const draft = drafts[categoryDraftKey(kind, "edit", item.id)];
  const source = draft
    ? {
        ...item,
        nameDefaultLanguage: draft.form.nameDefaultLanguage,
        nameSecondLanguage: draft.form.nameSecondLanguage,
      }
    : item;
  return getCategoryLabel(source, language) || fallback;
}

type ParentSectionsProps = {
  items: MenuCategory[];
  selectedId: number | null;
  isLoading: boolean;
  editorControls: CategoryEditorControls;
  onCreate: () => void;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
};

export function ParentSectionsNav({
  items,
  selectedId,
  isLoading,
  editorControls,
  onCreate,
  onSelect,
  onEdit,
  onDelete,
}: ParentSectionsProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { drafts, editor } = editorControls;
  const hasCreateDraft = categoryDraftKey("parent", "create") in drafts;

  return (
    <aside
      className="categories-page__nav"
      aria-label={t("admin.categories_parents")}
    >
      <p className="categories-page__eyebrow">
        {t("admin.categories_parents")}
      </p>

      {isLoading ? (
        <div className="categories-page__loading">
          <Loader2
            className="h-5 w-5 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        </div>
      ) : items.length === 0 ? (
        <p className="categories-page__empty">
          {t("admin.categories_parents_empty")}
        </p>
      ) : (
        <ul className="categories-page__nav-list">
          {items.map((item) => {
            const label = labelFor(
              item,
              drafts,
              "parent",
              language,
              t("menu.untitled"),
            );
            const isSelected = selectedId === item.id;
            const showEditor = isEditorOpenFor(
              editor,
              "parent",
              "edit",
              item.id,
            );

            return (
              <li key={item.id} className="categories-page__item">
                <div
                  className={`categories-page__nav-item${
                    isSelected ? " categories-page__nav-item--active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="categories-page__nav-select"
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="categories-page__nav-label">{label}</span>
                  </button>
                  <div className="categories-page__nav-actions">
                    <button
                      type="button"
                      className="categories-page__icon-btn"
                      aria-label={t("common.edit")}
                      aria-pressed={showEditor}
                      onClick={() => onEdit(item.id)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="categories-page__icon-btn categories-page__icon-btn--danger"
                      aria-label={t("common.delete")}
                      onClick={() => onDelete(item.id, label)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
                {showEditor && editor && (
                  <CategoryEditorPanel
                    editor={editor}
                    form={editorControls.form}
                    formError={editorControls.formError}
                    setField={editorControls.setField}
                    onSave={editorControls.onSave}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isEditorOpenFor(editor, "parent", "create") && editor && (
        <CategoryEditorPanel
          editor={editor}
          form={editorControls.form}
          formError={editorControls.formError}
          setField={editorControls.setField}
          onSave={editorControls.onSave}
        />
      )}

      <button
        type="button"
        className="categories-page__add"
        disabled={isLoading || hasCreateDraft}
        onClick={onCreate}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {t("admin.categories_add_parent")}
      </button>
    </aside>
  );
}

type ChildrenWorkspaceProps = {
  parentName: string | null;
  items: MenuCategory[];
  isLoading: boolean;
  editorControls: CategoryEditorControls;
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
};

export function ChildrenWorkspace({
  parentName,
  items,
  isLoading,
  editorControls,
  onCreate,
  onEdit,
  onDelete,
}: ChildrenWorkspaceProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { drafts, editor } = editorControls;
  const hasCreateDraft = categoryDraftKey("child", "create") in drafts;

  return (
    <section className="categories-page__workspace">
      <div className="categories-page__workspace-copy">
        <p className="categories-page__eyebrow">
          {t("admin.categories_children")}
        </p>
        <h2 className="categories-page__workspace-title">
          {parentName
            ? t("admin.categories_children_of", { name: parentName })
            : t("admin.categories_pick_parent")}
        </h2>
      </div>

      {isLoading ? (
        <div className="categories-page__loading">
          <Loader2
            className="h-5 w-5 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        </div>
      ) : !parentName ? (
        <p className="categories-page__empty">
          {t("admin.categories_pick_parent")}
        </p>
      ) : items.length === 0 ? (
        <p className="categories-page__empty">
          {t("admin.categories_children_empty")}
        </p>
      ) : (
        <ul className="categories-page__list">
          {items.map((item) => {
            const label = labelFor(
              item,
              drafts,
              "child",
              language,
              t("menu.untitled"),
            );
            const showEditor = isEditorOpenFor(
              editor,
              "child",
              "edit",
              item.id,
            );

            return (
              <li key={item.id} className="categories-page__item">
                <div className="categories-page__row">
                  <div className="categories-page__row-main">
                    <span className="categories-page__row-name">{label}</span>
                  </div>
                  <div className="categories-page__row-actions">
                    <button
                      type="button"
                      className="categories-page__icon-btn"
                      aria-label={t("common.edit")}
                      aria-pressed={showEditor}
                      onClick={() => onEdit(item.id)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="categories-page__icon-btn categories-page__icon-btn--danger"
                      aria-label={t("common.delete")}
                      onClick={() => onDelete(item.id, label)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
                {showEditor && editor && (
                  <CategoryEditorPanel
                    editor={editor}
                    form={editorControls.form}
                    formError={editorControls.formError}
                    setField={editorControls.setField}
                    onSave={editorControls.onSave}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isEditorOpenFor(editor, "child", "create") && editor && (
        <CategoryEditorPanel
          editor={editor}
          form={editorControls.form}
          formError={editorControls.formError}
          setField={editorControls.setField}
          onSave={editorControls.onSave}
        />
      )}

      <button
        type="button"
        className="categories-page__add"
        disabled={!parentName || isLoading || hasCreateDraft}
        onClick={onCreate}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {t("admin.categories_add_child")}
      </button>
    </section>
  );
}
