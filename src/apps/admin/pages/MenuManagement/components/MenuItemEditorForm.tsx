import type { FormEvent } from "react";
import { Loader2, Plus, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FeedbackBanner } from "@/ui/FeedbackBanner";
import type { MenuCategory } from "@/types/menuCategory";
import type {
  MenuItemEditorMode,
  MenuItemFormFieldErrors,
  MenuItemFormValues,
} from "../hooks/menuItemForm";
import { DishImagePicker } from "./DishImagePicker";
import { MenuItemCategoryFields } from "./MenuItemCategoryFields";
import { MenuItemMetaFields } from "./MenuItemMetaFields";
import {
  MenuItemCopyFields,
  MenuItemNamesFields,
} from "./MenuItemTextFields";

type MenuItemEditorFormProps = {
  mode: MenuItemEditorMode;
  form: MenuItemFormValues;
  fieldErrors: MenuItemFormFieldErrors;
  submitError: string | null;
  isSubmitting: boolean;
  imagePreviewUrl: string | null;
  parents: MenuCategory[];
  children: MenuCategory[];
  parentId: number | null;
  isLoadingParents: boolean;
  isLoadingChildren: boolean;
  categoriesError: string | null;
  selectParent: (id: number | null) => void;
  setField: <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function MenuItemEditorForm({
  mode,
  form,
  fieldErrors,
  submitError,
  isSubmitting,
  imagePreviewUrl,
  parents,
  children,
  parentId,
  isLoadingParents,
  isLoadingChildren,
  categoriesError,
  selectParent,
  setField,
  onImageChange,
  onSubmit,
}: MenuItemEditorFormProps) {
  const { t } = useTranslation();
  const isEdit = mode === "edit";

  return (
    <form className="menu-studio__form" onSubmit={onSubmit} noValidate>
      <section className="menu-studio__section">
        <h2>{t("menu.create_section_photo")}</h2>
        <DishImagePicker
          previewUrl={imagePreviewUrl}
          error={fieldErrors.image}
          onChange={onImageChange}
        />
      </section>

      <MenuItemNamesFields
        form={form}
        fieldErrors={fieldErrors}
        setField={setField}
      />

      <MenuItemCopyFields form={form} setField={setField} />

      <MenuItemMetaFields
        form={form}
        fieldErrors={fieldErrors}
        setField={setField}
      />

      <MenuItemCategoryFields
        form={form}
        fieldErrors={fieldErrors}
        parents={parents}
        children={children}
        parentId={parentId}
        isLoadingParents={isLoadingParents}
        isLoadingChildren={isLoadingChildren}
        categoriesError={categoriesError}
        selectParent={selectParent}
        setField={setField}
      />

      {submitError && (
        <FeedbackBanner tone="error" className="menu-studio__feedback">
          {submitError}
        </FeedbackBanner>
      )}

      <button
        type="submit"
        className="btn-accent menu-studio__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t(isEdit ? "menu.edit_saving" : "menu.create_saving")}
          </>
        ) : (
          <>
            {isEdit ? (
              <Save className="h-4 w-4" aria-hidden />
            ) : (
              <Plus className="h-4 w-4" aria-hidden />
            )}
            {t(isEdit ? "menu.edit_submit" : "menu.create_submit")}
          </>
        )}
      </button>
    </form>
  );
}
