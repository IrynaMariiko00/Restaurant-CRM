import { menuItemsApi } from "@/api/menuItems";
import { useFeedback } from "@/context/FeedbackContext";
import { useFormSubmitGate } from "@/hooks/useFormSubmitGate";
import { useImageUrl } from "@/hooks/useImageUrl";
import { validateMenuItemImage } from "@/shared/validation/validators";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  emptyMenuItemForm,
  menuItemToFormValues,
  toMenuItemRequest,
  validateMenuItemForm,
  type MenuItemEditorMode,
  type MenuItemFormFieldErrors,
  type MenuItemFormValues,
} from "./menuItemForm";

type UseMenuItemEditorOptions = {
  mode?: MenuItemEditorMode;
  itemId?: number;
};

type MenuItemEditorSnapshot = {
  form: MenuItemFormValues;
  hasNewImage: boolean;
  imageCleared: boolean;
};

export function useMenuItemEditor({
  mode = "create",
  itemId,
}: UseMenuItemEditorOptions = {}) {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const navigate = useNavigate();
  const [form, setForm] = useState<MenuItemFormValues>(emptyMenuItemForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [existingImageId, setExistingImageId] = useState<number | null>(null);
  const [showExistingImage, setShowExistingImage] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<MenuItemFormFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingItem, setIsLoadingItem] = useState(mode === "edit");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<MenuItemEditorSnapshot | undefined>(
    undefined,
  );

  const existingImageUrl = useImageUrl(existingImageId);
  const imagePreviewUrl =
    localPreviewUrl ?? (showExistingImage ? existingImageUrl : null);

  const values: MenuItemEditorSnapshot = {
    form,
    hasNewImage: imageFile != null,
    imageCleared: mode === "edit" && imageFile == null && !showExistingImage,
  };
  const { canSubmit } = useFormSubmitGate({
    values,
    baseline: mode === "edit" ? baseline : undefined,
    isComplete: Object.keys(validateMenuItemForm(form)).length === 0,
    isBusy: isSubmitting || isLoadingItem,
  });

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    if (mode !== "edit" || itemId == null || !Number.isFinite(itemId)) {
      setIsLoadingItem(false);
      setBaseline(undefined);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoadingItem(true);
      setLoadError(null);
      try {
        const response = await menuItemsApi.getMenuItem(itemId);
        if (cancelled) return;
        if (!response.success || !response.data) {
          setLoadError(response.errors?.[0] ?? "menu.item_load_error");
          return;
        }
        const formValues = menuItemToFormValues(response.data);
        setForm(formValues);
        setExistingImageId(response.data.imageId);
        setShowExistingImage(true);
        setImageFile(null);
        setBaseline({
          form: formValues,
          hasNewImage: false,
          imageCleared: false,
        });
      } catch {
        if (!cancelled) setLoadError("menu.item_load_error");
      } finally {
        if (!cancelled) setIsLoadingItem(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, itemId]);

  const setField = <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as keyof MenuItemFormFieldErrors];
      return next;
    });
    if (submitError) setSubmitError(null);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setShowExistingImage(false);
      setFieldErrors((prev) => {
        if (!prev.image) return prev;
        const next = { ...prev };
        delete next.image;
        return next;
      });
      return;
    }

    const error = validateMenuItemImage(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, image: error }));
      return;
    }

    setImageFile(file);
    setShowExistingImage(true);
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setFieldErrors((prev) => {
      if (!prev.image) return prev;
      const next = { ...prev };
      delete next.image;
      return next;
    });
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);

    const errors = validateMenuItemForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = toMenuItemRequest(form);
    setIsSubmitting(true);
    try {
      const response =
        mode === "edit" && itemId != null
          ? await menuItemsApi.updateMenuItem(itemId, payload, imageFile)
          : await menuItemsApi.createMenuItem(payload, imageFile);

      if (!response.success || !response.data) {
        setSubmitError(
          response.errors?.[0] ??
            response.message ??
            t(mode === "edit" ? "menu.edit_error" : "menu.create_error"),
        );
        return;
      }

      feedback.success(
        t(
          mode === "edit"
            ? "menu.edit_success_title"
            : "menu.create_success_title",
        ),
      );
      navigate("/staff/menu", { replace: true });
    } catch {
      setSubmitError(
        t(mode === "edit" ? "menu.edit_error" : "menu.create_error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mode,
    form,
    setField,
    imagePreviewUrl,
    handleImageChange,
    fieldErrors,
    submitError,
    isSubmitting,
    canSubmit,
    isLoadingItem,
    loadError,
    handleSubmit,
  };
}
