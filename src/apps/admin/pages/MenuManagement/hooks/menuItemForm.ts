import type { MenuItem, MenuItemRequest } from "@/types/menuItem";

export type MenuItemFormValues = {
  nameDefaultLanguage: string;
  nameSecondLanguage: string;
  descriptionDefaultLanguage: string;
  descriptionSecondLanguage: string;
  ingredientsDefaultLanguage: string[];
  ingredientsSecondLanguage: string[];
  isAllergenic: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  maxQuantityPerPerson: string;
  weightGrams: string;
  price: string;
  childCategoryId: number | null;
};

export type MenuItemFormFieldErrors = Partial<
  Record<
    | "nameDefaultLanguage"
    | "price"
    | "childCategoryId"
    | "image"
    | "maxQuantityPerPerson"
    | "weightGrams",
    string
  >
>;

export type MenuItemEditorMode = "create" | "edit";

export const emptyMenuItemForm: MenuItemFormValues = {
  nameDefaultLanguage: "",
  nameSecondLanguage: "",
  descriptionDefaultLanguage: "",
  descriptionSecondLanguage: "",
  ingredientsDefaultLanguage: [],
  ingredientsSecondLanguage: [],
  isAllergenic: false,
  isVegetarian: false,
  isVegan: false,
  maxQuantityPerPerson: "",
  weightGrams: "",
  price: "",
  childCategoryId: null,
};

export function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 0) return NaN;
  return n;
}

export function validateMenuItemForm(
  form: MenuItemFormValues,
): MenuItemFormFieldErrors {
  const errors: MenuItemFormFieldErrors = {};

  if (!form.nameDefaultLanguage.trim()) {
    errors.nameDefaultLanguage = "menu.create_name_required";
  }

  const price = Number(form.price.replace(",", "."));
  if (!form.price.trim() || !Number.isFinite(price) || price < 0) {
    errors.price = "menu.create_price_invalid";
  }

  if (form.childCategoryId == null || form.childCategoryId <= 0) {
    errors.childCategoryId = "menu.create_category_required";
  }

  const maxQty = parseOptionalInt(form.maxQuantityPerPerson);
  if (Number.isNaN(maxQty)) {
    errors.maxQuantityPerPerson = "menu.create_number_invalid";
  }

  const weight = parseOptionalInt(form.weightGrams);
  if (Number.isNaN(weight)) {
    errors.weightGrams = "menu.create_number_invalid";
  }

  return errors;
}

export function toMenuItemRequest(form: MenuItemFormValues): MenuItemRequest {
  const price = Number(form.price.replace(",", "."));

  return {
    nameDefaultLanguage: form.nameDefaultLanguage.trim() || undefined,
    nameSecondLanguage: form.nameSecondLanguage.trim() || undefined,
    descriptionDefaultLanguage:
      form.descriptionDefaultLanguage.trim() || undefined,
    descriptionSecondLanguage:
      form.descriptionSecondLanguage.trim() || undefined,
    ingredientsDefaultLanguage: form.ingredientsDefaultLanguage,
    ingredientsSecondLanguage: form.ingredientsSecondLanguage,
    isAllergenic: form.isAllergenic,
    isVegetarian: form.isVegetarian,
    isVegan: form.isVegan,
    maxQuantityPerPerson: parseOptionalInt(form.maxQuantityPerPerson),
    weightGrams: parseOptionalInt(form.weightGrams),
    price,
    childCategoryId: form.childCategoryId!,
  };
}

export function menuItemToFormValues(item: MenuItem): MenuItemFormValues {
  return {
    nameDefaultLanguage: item.nameDefaultLanguage ?? "",
    nameSecondLanguage: item.nameSecondLanguage ?? "",
    descriptionDefaultLanguage: item.descriptionDefaultLanguage ?? "",
    descriptionSecondLanguage: item.descriptionSecondLanguage ?? "",
    ingredientsDefaultLanguage: item.ingredientsDefaultLanguage ?? [],
    ingredientsSecondLanguage: item.ingredientsSecondLanguage ?? [],
    isAllergenic: item.isAllergenic,
    isVegetarian: item.isVegetarian,
    isVegan: item.isVegan,
    maxQuantityPerPerson:
      item.maxQuantityPerPerson != null
        ? String(item.maxQuantityPerPerson)
        : "",
    weightGrams: item.weightGrams != null ? String(item.weightGrams) : "",
    price: String(item.price),
    childCategoryId: item.childCategoryId,
  };
}
