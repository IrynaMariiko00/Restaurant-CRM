import { authApi } from "@/api/auth";
import type { RegisterEmployeeRequest } from "@/types/auth";
import {
  normalizeUaPhone,
  validateProfileForm,
  validateProfilePicture,
  type ProfileFormErrors,
} from "@/shared/validation/validators";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const emptyForm: RegisterEmployeeRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  isAdmin: false,
};

export const useRegisterEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterEmployeeRequest>(emptyForm);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ProfileFormErrors & { avatar?: string }
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof RegisterEmployeeRequest>(
    key: K,
    value: RegisterEmployeeRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key as keyof ProfileFormErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof ProfileFormErrors];
      return next;
    });
    if (submitError) setSubmitError(null);
  };

  const handleAvatarChange = (file: File) => {
    const error = validateProfilePicture(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, avatar: error }));
      return;
    }

    setProfilePictureFile(file);
    setAvatarPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setFieldErrors((prev) => {
      if (!prev.avatar) return prev;
      const next = { ...prev };
      delete next.avatar;
      return next;
    });
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

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

    setIsSubmitting(true);

    try {
      const payload: RegisterEmployeeRequest = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: normalizedPhone,
        isAdmin: form.isAdmin,
      };

      const response = await authApi.registerEmployee(
        payload,
        profilePictureFile,
      );

      if (!response.success || !response.data) {
        setSubmitError(response.errors?.[0] ?? t("admin.register_error"));
        return;
      }

      navigate("/staff/users", {
        replace: true,
        state: {
          registeredEmail: response.data.email,
        },
      });
    } catch {
      setSubmitError(t("admin.register_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    setField,
    avatarPreviewUrl,
    handleAvatarChange,
    fieldErrors,
    submitError,
    isSubmitting,
    handleSubmit,
    t,
  };
};
