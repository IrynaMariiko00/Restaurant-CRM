import { employeeApi } from "@/api/employee";
import { imagesApi } from "@/api/images";
import type { UpdateEmployeeRequest } from "@/types/employee";
import {
  normalizeUaPhone,
  validateProfileForm,
  validateProfilePicture,
  type ProfileFormErrors,
} from "@/shared/validation/validators";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const [profilePictureId, setProfilePictureId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const avatarObjectUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});

  const revokeAvatarUrl = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
  };

  const setAvatarFromBlob = (blob: Blob | null) => {
    revokeAvatarUrl();
    if (!blob) {
      setAvatarUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    avatarObjectUrlRef.current = url;
    setAvatarUrl(url);
  };

  const loadAvatarById = async (id: number | null | undefined) => {
    if (!id || id <= 0) {
      setAvatarFromBlob(null);
      return;
    }

    try {
      const blob = await imagesApi.getImage(id);
      setAvatarFromBlob(blob);
    } catch {
      setAvatarFromBlob(null);
    }
  };

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

        const {
          firstName,
          lastName,
          email,
          phone,
          emailConfirmed,
          profilePictureId: pictureId,
        } = response.data;
        const profileData = { firstName, lastName, email, phone };

        setForm(profileData);
        setInitialData(profileData);
        setEmailConfirmed(emailConfirmed);
        setProfilePictureId(pictureId ?? null);
        await loadAvatarById(pictureId);
        if (cancelled) {
          revokeAvatarUrl();
        }
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
      revokeAvatarUrl();
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
    setProfilePictureFile(null);
    setIsEditing(false);
    setSaveError(null);
    setFieldErrors({});
    void loadAvatarById(profilePictureId);
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

  const handleAvatarChange = (file: File) => {
    const error = validateProfilePicture(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, avatar: error }));
      return;
    }

    setProfilePictureFile(file);
    setAvatarFromBlob(file);
    setFieldErrors((prev) => {
      if (!prev.avatar) return prev;
      const next = { ...prev };
      delete next.avatar;
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

      const response = await employeeApi.updateMe(payload, profilePictureFile);

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
        profilePictureId: newPictureId,
      } = response.data;
      const updatedData = { firstName, lastName, email, phone };

      setForm(updatedData);
      setInitialData(updatedData);
      setEmailConfirmed(newConfirmed);
      setProfilePictureId(newPictureId ?? null);
      setProfilePictureFile(null);
      setFieldErrors({});
      setIsEditing(false);
      setSuccess(
        newConfirmed
          ? t("staff.profile_save_success")
          : t("staff.profile_email_pending"),
      );

      if (profilePictureFile && newPictureId) {
        await loadAvatarById(newPictureId);
      } else if (!newPictureId) {
        setAvatarFromBlob(null);
      }
    } catch (err) {
      handleError(err, setSaveError, t("staff.profile_save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    emailConfirmed,
    avatarUrl,
    isEditing,
    isLoading,
    isSaving,
    loadError,
    saveError,
    success,
    fieldErrors,
    setField,
    handleAvatarChange,
    startEditing,
    cancelEditing,
    handleSubmit,
    t,
  };
};
