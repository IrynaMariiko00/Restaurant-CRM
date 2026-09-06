import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

type IngredientTagsInputProps = {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
};

export function IngredientTagsInput({
  id,
  label,
  values,
  onChange,
}: IngredientTagsInputProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    for (const part of parts) {
      if (!next.includes(part)) next.push(part);
    }
    onChange(next);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && !draft && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="menu-studio__tags">
        {values.map((value) => (
          <span key={value} className="menu-studio__tag">
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((item) => item !== value))}
              aria-label={t("menu.create_remove_ingredient", { name: value })}
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) commit(draft);
          }}
          className="menu-studio__tags-input"
          placeholder={t("menu.create_ingredients_placeholder")}
        />
      </div>
    </div>
  );
}
