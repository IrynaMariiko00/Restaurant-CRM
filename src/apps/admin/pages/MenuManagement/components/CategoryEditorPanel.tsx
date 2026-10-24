import { useId } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FeedbackBanner } from "@/ui/FeedbackBanner";
import type {
  CategoryEditorState,
  CategoryFormValues,
} from "../hooks/useMenuCategoriesAdmin";

export const CATEGORY_EDITOR_FORM_ID = "category-editor-form";

type CategoryEditorPanelProps = {
  editor: CategoryEditorState;
  form: CategoryFormValues;
  formError: string | null;
  setField: <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K],
  ) => void;
  onSave: () => void;
};

export function CategoryEditorPanel({
  editor,
  form,
  formError,
  setField,
  onSave,
}: CategoryEditorPanelProps) {
  const { t } = useTranslation();
  const baseId = useId();

  const titleKey =
    editor.mode === "create"
      ? editor.kind === "parent"
        ? "admin.categories_create_parent"
        : "admin.categories_create_child"
      : editor.kind === "parent"
        ? "admin.categories_edit_parent"
        : "admin.categories_edit_child";

  return (
    <div
      className="categories-page__dropdown"
      role="region"
      aria-label={t(titleKey)}
    >
      <form
        id={CATEGORY_EDITOR_FORM_ID}
        className="categories-page__form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div className="form-field">
          <label htmlFor={`${baseId}-second`} className="form-label">
            {t("admin.categories_name_second")}
          </label>
          <input
            id={`${baseId}-second`}
            className="form-input"
            value={form.nameSecondLanguage}
            onChange={(e) => setField("nameSecondLanguage", e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${baseId}-default`} className="form-label">
            {t("admin.categories_name_default")}
          </label>
          <input
            id={`${baseId}-default`}
            className="form-input"
            value={form.nameDefaultLanguage}
            onChange={(e) => setField("nameDefaultLanguage", e.target.value)}
            autoComplete="off"
          />
        </div>

        {formError && (
          <FeedbackBanner tone="error">{formError}</FeedbackBanner>
        )}
      </form>
    </div>
  );
}

type CategoryEditorActionsProps = {
  isSaving: boolean;
  canSubmit: boolean;
  onCancel: () => void;
};

export function CategoryEditorActions({
  isSaving,
  canSubmit,
  onCancel,
}: CategoryEditorActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="categories-page__editor-actions">
      <button
        type="button"
        className="btn-ghost"
        onClick={onCancel}
        disabled={isSaving}
      >
        {t("common.cancel")}
      </button>
      <button
        type="submit"
        form={CATEGORY_EDITOR_FORM_ID}
        className="btn-accent"
        disabled={!canSubmit}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t("admin.categories_saving")}
          </>
        ) : (
          t("admin.categories_save")
        )}
      </button>
    </div>
  );
}
