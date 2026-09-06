import { Image } from "lucide-react";
import { formatMenuPrice } from "@/shared/menu/itemCopy";
import { MenuDishFlags } from "@/pages/Menu/components/MenuDishFlags";
import type { MenuItemFormValues } from "../hooks/menuItemForm";
import { useTranslation } from "react-i18next";

type MenuItemLivePreviewProps = {
  form: MenuItemFormValues;
  imagePreviewUrl: string | null;
  categoryLabel?: string | null;
};

export function MenuItemLivePreview({
  form,
  imagePreviewUrl,
  categoryLabel,
}: MenuItemLivePreviewProps) {
  const { t } = useTranslation();
  const name =
    form.nameDefaultLanguage.trim() ||
    form.nameSecondLanguage.trim() ||
    t("menu.create_preview_untitled");
  const description =
    form.descriptionDefaultLanguage.trim() ||
    form.descriptionSecondLanguage.trim();
  const priceNumber = Number(form.price.replace(",", "."));
  const priceLabel =
    form.price.trim() && Number.isFinite(priceNumber)
      ? formatMenuPrice(priceNumber)
      : "—";

  return (
    <article className="menu-studio__preview-card">
      <div className="menu-studio__preview-media">
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="" />
        ) : (
          <div
            className="menu-studio__preview-placeholder"
            aria-label={t("menu.create_preview_photo")}
          >
            <Image
              className="menu-studio__preview-placeholder-icon"
              aria-hidden
              strokeWidth={1.25}
            />
          </div>
        )}
      </div>
      <div className="menu-studio__preview-body">
        {categoryLabel && (
          <p className="menu-studio__preview-category">{categoryLabel}</p>
        )}
        <p className="menu-studio__preview-price">{priceLabel}</p>
        <h2 className="menu-studio__preview-title">{name}</h2>
        {description && (
          <p className="menu-studio__preview-lead">{description}</p>
        )}
        <MenuDishFlags
          item={{
            isAllergenic: form.isAllergenic,
            isVegetarian: form.isVegetarian,
            isVegan: form.isVegan,
          }}
        />
        {form.ingredientsDefaultLanguage.length > 0 && (
          <p className="menu-studio__preview-ingredients">
            {form.ingredientsDefaultLanguage.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
