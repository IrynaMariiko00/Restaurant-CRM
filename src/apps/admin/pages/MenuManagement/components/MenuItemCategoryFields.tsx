import { useTranslation } from "react-i18next";
import { FormSelect } from "@/ui/FormSelect";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import type { MenuCategory } from "@/types/menuCategory";
import type {
  MenuItemFormFieldErrors,
  MenuItemFormValues,
} from "../hooks/menuItemForm";

type MenuItemCategoryFieldsProps = {
  form: MenuItemFormValues;
  fieldErrors: MenuItemFormFieldErrors;
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
};

export function MenuItemCategoryFields({
  form,
  fieldErrors,
  parents,
  children,
  parentId,
  isLoadingParents,
  isLoadingChildren,
  categoriesError,
  selectParent,
  setField,
}: MenuItemCategoryFieldsProps) {
  const { t, i18n } = useTranslation();

  return (
    <section className="menu-studio__section">
      <h2>{t("menu.create_section_category")}</h2>
      {categoriesError ? (
        <p className="menu-studio__error">{t(categoriesError)}</p>
      ) : (
        <div className="menu-studio__grid">
          <div className="form-field">
            <label htmlFor="parent-category" className="form-label">
              {t("menu.create_parent_category")}
            </label>
            <FormSelect
              id="parent-category"
              value={parentId != null ? String(parentId) : ""}
              disabled={isLoadingParents}
              placeholder={
                isLoadingParents
                  ? t("common.waiting")
                  : t("menu.create_parent_placeholder")
              }
              options={parents.map((parent) => ({
                value: String(parent.id),
                label: getCategoryLabel(
                  parent,
                  i18n.resolvedLanguage ?? i18n.language,
                ),
              }))}
              onChange={(next) => {
                const value = next ? Number(next) : null;
                selectParent(value);
                setField("childCategoryId", null);
              }}
            />
          </div>
          <div className="form-field">
            <label htmlFor="child-category" className="form-label">
              {t("menu.create_child_category")}
              <span className="form-label__required" aria-hidden>
                *
              </span>
            </label>
            <FormSelect
              id="child-category"
              value={
                form.childCategoryId != null
                  ? String(form.childCategoryId)
                  : ""
              }
              disabled={parentId == null || isLoadingChildren}
              required
              aria-required
              error={
                parentId != null && Boolean(fieldErrors.childCategoryId)
              }
              placeholder={
                parentId == null
                  ? t("menu.create_parent_placeholder")
                  : isLoadingChildren
                    ? t("common.waiting")
                    : t("menu.create_child_placeholder")
              }
              options={children.map((child) => ({
                value: String(child.id),
                label: getCategoryLabel(
                  child,
                  i18n.resolvedLanguage ?? i18n.language,
                ),
              }))}
              onChange={(next) => {
                const value = next ? Number(next) : null;
                setField("childCategoryId", value);
              }}
            />
            {parentId != null && fieldErrors.childCategoryId && (
              <p className="menu-studio__error">
                {t(fieldErrors.childCategoryId)}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
