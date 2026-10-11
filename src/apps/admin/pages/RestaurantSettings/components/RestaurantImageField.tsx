import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type RestaurantImageFieldProps = {
  id: string;
  label: string;
  previewUrl: string | null;
  error?: string | null;
  variant?: "logo" | "background";
  canClear?: boolean;
  onChange: (file: File | null) => void;
};

export function RestaurantImageField({
  id,
  label,
  previewUrl,
  error,
  variant = "background",
  canClear = false,
  onChange,
}: RestaurantImageFieldProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`restaurant-image-field restaurant-image-field--${variant}`}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange(file);
          e.target.value = "";
        }}
      />

      {previewUrl ? (
        <div
          className={`restaurant-image-field__preview restaurant-image-field__preview--${variant}`}
        >
          <img src={previewUrl} alt="" />
          <div className="restaurant-image-field__actions">
            <button
              type="button"
              className="restaurant-image-field__change"
              onClick={() => inputRef.current?.click()}
            >
              {t("admin.restaurant_change_image")}
            </button>
            {canClear && (
              <button
                type="button"
                className="restaurant-image-field__remove"
                onClick={() => onChange(null)}
                aria-label={t("menu.create_remove_image")}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`restaurant-image-field__drop restaurant-image-field__drop--${variant}`}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-6 w-6" aria-hidden />
          <span>{t("admin.restaurant_add_image")}</span>
          <span className="restaurant-image-field__hint">
            {t("menu.create_image_hint")}
          </span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-[var(--error-color)]">{t(error)}</p>
      )}
    </div>
  );
}
