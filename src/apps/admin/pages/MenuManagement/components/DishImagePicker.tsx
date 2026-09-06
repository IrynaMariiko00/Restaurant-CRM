import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type DishImagePickerProps = {
  previewUrl: string | null;
  error?: string | null;
  onChange: (file: File | null) => void;
};

export function DishImagePicker({
  previewUrl,
  error,
  onChange,
}: DishImagePickerProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="menu-studio__photo">
      <input
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
        <div className="menu-studio__photo-preview">
          <img src={previewUrl} alt="" />
          <button
            type="button"
            className="menu-studio__photo-remove"
            onClick={() => onChange(null)}
            aria-label={t("menu.create_remove_image")}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="menu-studio__photo-drop"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-7 w-7" aria-hidden />
          <span>{t("menu.create_add_image")}</span>
          <span className="menu-studio__photo-hint">
            {t("menu.create_image_hint")}
          </span>
        </button>
      )}

      {error && <p className="menu-studio__error">{t(error)}</p>}
    </div>
  );
}
