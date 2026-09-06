import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  id?: string;
  value: string;
  options: FormSelectOption[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  "aria-required"?: boolean;
  onChange: (value: string) => void;
};

export function FormSelect({
  id,
  value,
  options,
  placeholder,
  disabled = false,
  required = false,
  error = false,
  "aria-required": ariaRequired,
  onChange,
}: FormSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listId = `${selectId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label || placeholder;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`form-select${open ? " form-select--open" : ""}${
        disabled ? " form-select--disabled" : ""
      }${error ? " form-select--error" : ""}`}
    >
      <button
        id={selectId}
        type="button"
        className="form-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={ariaRequired ?? required}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={`form-select__value${
            selected ? "" : " form-select__value--placeholder"
          }`}
        >
          {displayLabel}
        </span>
        <ChevronDown className="form-select__chevron" aria-hidden strokeWidth={2.25} />
      </button>

      {open && !disabled && (
        <ul id={listId} className="form-select__menu" role="listbox" tabIndex={-1}>
          <li role="presentation">
            <button
              type="button"
              role="option"
              className={`form-select__option${!value ? " form-select__option--active" : ""}`}
              aria-selected={!value}
              onClick={() => pick("")}
            >
              {placeholder}
            </button>
          </li>
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  className={`form-select__option${
                    active ? " form-select__option--active" : ""
                  }`}
                  aria-selected={active}
                  onClick={() => pick(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
