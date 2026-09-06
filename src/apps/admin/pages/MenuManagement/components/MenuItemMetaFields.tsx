import { useTranslation } from "react-i18next";
import type {
  MenuItemFormFieldErrors,
  MenuItemFormValues,
} from "../hooks/menuItemForm";
import { MenuItemFlagToggles } from "./MenuItemFlagToggles";

type MenuItemMetaFieldsProps = {
  form: MenuItemFormValues;
  fieldErrors: MenuItemFormFieldErrors;
  setField: <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => void;
};

export function MenuItemMetaFields({
  form,
  fieldErrors,
  setField,
}: MenuItemMetaFieldsProps) {
  const { t } = useTranslation();

  return (
    <section className="menu-studio__section">
      <h2>{t("menu.create_section_meta")}</h2>
      <div className="menu-studio__grid menu-studio__grid--3">
        <div className="form-field">
          <label htmlFor="price" className="form-label">
            {t("menu.create_price")}
            <span className="form-label__required" aria-hidden>
              *
            </span>
          </label>
          <input
            id="price"
            inputMode="decimal"
            className={`form-input${fieldErrors.price ? " form-input--error" : ""}`}
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            required
            aria-required="true"
          />
          {fieldErrors.price && (
            <p className="menu-studio__error">{t(fieldErrors.price)}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="weight" className="form-label">
            {t("menu.weight")}
          </label>
          <input
            id="weight"
            inputMode="numeric"
            className={`form-input${
              fieldErrors.weightGrams ? " form-input--error" : ""
            }`}
            value={form.weightGrams}
            onChange={(e) => setField("weightGrams", e.target.value)}
          />
          {fieldErrors.weightGrams && (
            <p className="menu-studio__error">{t(fieldErrors.weightGrams)}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="max-qty" className="form-label">
            {t("menu.max_quantity")}
          </label>
          <input
            id="max-qty"
            inputMode="numeric"
            className={`form-input${
              fieldErrors.maxQuantityPerPerson ? " form-input--error" : ""
            }`}
            value={form.maxQuantityPerPerson}
            onChange={(e) => setField("maxQuantityPerPerson", e.target.value)}
          />
          {fieldErrors.maxQuantityPerPerson && (
            <p className="menu-studio__error">
              {t(fieldErrors.maxQuantityPerPerson)}
            </p>
          )}
        </div>
      </div>

      <MenuItemFlagToggles form={form} setField={setField} />
    </section>
  );
}
