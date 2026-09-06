import { useTranslation } from "react-i18next";
import type {
  MenuItemFormFieldErrors,
  MenuItemFormValues,
} from "../hooks/menuItemForm";
import { IngredientTagsInput } from "./IngredientTagsInput";

type MenuItemCopyFieldsProps = {
  form: MenuItemFormValues;
  setField: <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => void;
};

export function MenuItemCopyFields({
  form,
  setField,
}: MenuItemCopyFieldsProps) {
  const { t } = useTranslation();

  return (
    <section className="menu-studio__section">
      <h2>{t("menu.create_section_copy")}</h2>
      <div className="menu-studio__grid">
        <div className="form-field">
          <label htmlFor="desc-default" className="form-label">
            {t("menu.create_desc_default")}
          </label>
          <textarea
            id="desc-default"
            className="form-input menu-studio__textarea"
            rows={3}
            value={form.descriptionDefaultLanguage}
            onChange={(e) =>
              setField("descriptionDefaultLanguage", e.target.value)
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="desc-second" className="form-label">
            {t("menu.create_desc_second")}
          </label>
          <textarea
            id="desc-second"
            className="form-input menu-studio__textarea"
            rows={3}
            value={form.descriptionSecondLanguage}
            onChange={(e) =>
              setField("descriptionSecondLanguage", e.target.value)
            }
          />
        </div>
      </div>
      <IngredientTagsInput
        id="ingredients-default"
        label={t("menu.create_ingredients_default")}
        values={form.ingredientsDefaultLanguage}
        onChange={(values) => setField("ingredientsDefaultLanguage", values)}
      />
      <IngredientTagsInput
        id="ingredients-second"
        label={t("menu.create_ingredients_second")}
        values={form.ingredientsSecondLanguage}
        onChange={(values) => setField("ingredientsSecondLanguage", values)}
      />
    </section>
  );
}

type MenuItemNamesFieldsProps = {
  form: MenuItemFormValues;
  fieldErrors: MenuItemFormFieldErrors;
  setField: <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => void;
};

export function MenuItemNamesFields({
  form,
  fieldErrors,
  setField,
}: MenuItemNamesFieldsProps) {
  const { t } = useTranslation();

  return (
    <section className="menu-studio__section">
      <h2>{t("menu.create_section_names")}</h2>
      <div className="menu-studio__grid">
        <div className="form-field">
          <label htmlFor="name-default" className="form-label">
            {t("menu.create_name_default")}
            <span className="form-label__required" aria-hidden>
              *
            </span>
          </label>
          <input
            id="name-default"
            className={`form-input${
              fieldErrors.nameDefaultLanguage ? " form-input--error" : ""
            }`}
            value={form.nameDefaultLanguage}
            onChange={(e) => setField("nameDefaultLanguage", e.target.value)}
            autoComplete="off"
            required
            aria-required="true"
          />
          {fieldErrors.nameDefaultLanguage && (
            <p className="menu-studio__error">
              {t(fieldErrors.nameDefaultLanguage)}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="name-second" className="form-label">
            {t("menu.create_name_second")}
          </label>
          <input
            id="name-second"
            className="form-input"
            value={form.nameSecondLanguage}
            onChange={(e) => setField("nameSecondLanguage", e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
    </section>
  );
}
