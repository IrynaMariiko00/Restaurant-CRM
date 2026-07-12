import { employeeApi } from "@/api/employee";
import type { UpdateEmployeeRequest } from "@/types/employee";
import {
  normalizeUaPhone,
  validateProfileForm,
  type ProfileFormErrors,
} from "@/shared/validation/validators";
import { isAxiosError } from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

const emptyForm: UpdateEmployeeRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export const useEmployeeProfile = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<UpdateEmployeeRequest>(emptyForm);
  const [initialData, setInitialData] =
    useState<UpdateEmployeeRequest>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await employeeApi.getMe();
        if (cancelled) return;

        if (!response.success || !response.data) {
          setLoadError(response.errors?.[0] ?? t("staff.profile_load_error"));
          return;
        }

        const { firstName, lastName, email, phone, emailConfirmed } =
          response.data;
        const profileData = { firstName, lastName, email, phone };

        setForm(profileData);
        setInitialData(profileData);
        setEmailConfirmed(emailConfirmed);
      } catch (err) {
        if (cancelled) return;
        handleError(err, setLoadError, t("staff.profile_load_error"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleError = (
    err: unknown,
    setError: (msg: string) => void,
    defaultMsg: string,
  ) => {
    if (isAxiosError(err)) {
      const apiErrors = err.response?.data?.errors as string[] | undefined;
      setError(apiErrors?.[0] ?? defaultMsg);
    } else {
      setError(defaultMsg);
    }
  };

  const startEditing = () => {
    setSuccess(null);
    setFieldErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(initialData);
    setIsEditing(false);
    setSaveError(null);
    setFieldErrors({});
  };

  const setField = <K extends keyof UpdateEmployeeRequest>(
    key: K,
    value: UpdateEmployeeRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key as keyof ProfileFormErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof ProfileFormErrors];
      return next;
    });
    if (saveError) setSaveError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError(null);
    setSuccess(null);

    const errors = validateProfileForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const normalizedPhone = normalizeUaPhone(form.phone);
    if (!normalizedPhone) {
      setFieldErrors({ phone: "validation.phone_ua" });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: normalizedPhone,
      };

      const response = await employeeApi.updateMe(payload);

      if (!response.success || !response.data) {
        setSaveError(response.errors?.[0] ?? t("staff.profile_save_error"));
        return;
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        emailConfirmed: newConfirmed,
      } = response.data;
      const updatedData = { firstName, lastName, email, phone };

      setForm(updatedData);
      setInitialData(updatedData);
      setEmailConfirmed(newConfirmed);
      setFieldErrors({});
      setIsEditing(false);
      setSuccess(
        newConfirmed
          ? t("staff.profile_save_success")
          : t("staff.profile_email_pending"),
      );
    } catch (err) {
      handleError(err, setSaveError, t("staff.profile_save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    emailConfirmed,
    isEditing,
    isLoading,
    isSaving,
    loadError,
    saveError,
    success,
    fieldErrors,
    setField,
    startEditing,
    cancelEditing,
    handleSubmit,
    t,
  };
};
