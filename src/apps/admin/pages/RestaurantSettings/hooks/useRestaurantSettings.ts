import { restaurantApi } from "@/api/restaurant";
import { useFeedback } from "@/context/FeedbackContext";
import { useFormSubmitGate } from "@/hooks/useFormSubmitGate";
import { useImageUrl } from "@/hooks/useImageUrl";
import { setRestaurantProfileCache } from "@/hooks/useRestaurantProfile";
import { validateMenuItemImage } from "@/shared/validation/validators";
import type { Restaurant, RestaurantRegion } from "@/types/restaurant";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

type FieldErrors = {
  name?: string;
  logo?: string;
  backgroundImage?: string;
};

type RestaurantSettingsSnapshot = {
  name: string;
  defaultRegion: RestaurantRegion;
  hasLogoFile: boolean;
  hasBackgroundFile: boolean;
};

export function useRestaurantSettings() {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [name, setName] = useState("");
  const [defaultRegion, setDefaultRegion] =
    useState<RestaurantRegion>("UKRAINE");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [logoPreviewLocal, setLogoPreviewLocal] = useState<string | null>(null);
  const [backgroundPreviewLocal, setBackgroundPreviewLocal] = useState<
    string | null
  >(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingLogoUrl = useImageUrl(restaurant?.logoId);
  const existingBackgroundUrl = useImageUrl(restaurant?.backgroundImageId);

  const logoPreviewUrl = logoPreviewLocal ?? existingLogoUrl;
  const backgroundPreviewUrl = backgroundPreviewLocal ?? existingBackgroundUrl;

  const values: RestaurantSettingsSnapshot = {
    name,
    defaultRegion,
    hasLogoFile: logoFile != null,
    hasBackgroundFile: backgroundFile != null,
  };
  const baseline: RestaurantSettingsSnapshot | undefined = restaurant
    ? {
        name: restaurant.name ?? "",
        defaultRegion: restaurant.defaultRegion ?? "UKRAINE",
        hasLogoFile: false,
        hasBackgroundFile: false,
      }
    : undefined;
  const { canSubmit } = useFormSubmitGate({
    values,
    baseline,
    isComplete: name.trim().length > 0,
    isBusy: isSubmitting,
  });

  useEffect(() => {
    return () => {
      if (logoPreviewLocal) URL.revokeObjectURL(logoPreviewLocal);
      if (backgroundPreviewLocal) URL.revokeObjectURL(backgroundPreviewLocal);
    };
  }, [logoPreviewLocal, backgroundPreviewLocal]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await restaurantApi.getRestaurant();
        if (cancelled) return;
        if (!response.success || !response.data) {
          setLoadError(
            response.errors?.[0] ?? t("admin.restaurant_load_error"),
          );
          return;
        }
        setRestaurant(response.data);
        setName(response.data.name ?? "");
        setDefaultRegion(response.data.defaultRegion ?? "UKRAINE");
      } catch {
        if (!cancelled) setLoadError(t("admin.restaurant_load_error"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const clearFieldError = (key: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    clearFieldError("name");
    setSubmitError(null);
  };

  const handleRegionChange = (value: RestaurantRegion) => {
    setDefaultRegion(value);
    setSubmitError(null);
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      setLogoFile(null);
      setLogoPreviewLocal((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      clearFieldError("logo");
      return;
    }

    const error = validateMenuItemImage(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, logo: error }));
      return;
    }

    setLogoFile(file);
    setLogoPreviewLocal((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    clearFieldError("logo");
    setSubmitError(null);
  };

  const handleBackgroundChange = (file: File | null) => {
    if (!file) {
      setBackgroundFile(null);
      setBackgroundPreviewLocal((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      clearFieldError("backgroundImage");
      return;
    }

    const error = validateMenuItemImage(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, backgroundImage: error }));
      return;
    }

    setBackgroundFile(file);
    setBackgroundPreviewLocal((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    clearFieldError("backgroundImage");
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setFieldErrors((prev) => ({ ...prev, name: "validation.required" }));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await restaurantApi.updateRestaurant(
        { name: trimmed, defaultRegion },
        {
          logo: logoFile,
          backgroundImage: backgroundFile,
        },
      );

      if (!response.success || !response.data) {
        setSubmitError(
          response.errors?.[0] ?? t("admin.restaurant_save_error"),
        );
        return;
      }

      setRestaurant(response.data);
      setName(response.data.name ?? "");
      setDefaultRegion(response.data.defaultRegion ?? "UKRAINE");
      setLogoFile(null);
      setBackgroundFile(null);
      setLogoPreviewLocal((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setBackgroundPreviewLocal((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setRestaurantProfileCache(response.data);
      feedback.success(t("admin.restaurant_save_success"));
    } catch {
      setSubmitError(t("admin.restaurant_save_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    restaurant,
    name,
    defaultRegion,
    logoPreviewUrl,
    backgroundPreviewUrl,
    fieldErrors,
    loadError,
    submitError,
    isLoading,
    isSubmitting,
    canSubmit,
    handleNameChange,
    handleRegionChange,
    handleLogoChange,
    handleBackgroundChange,
    handleSubmit,
    t,
  };
}
