import { employeeApi } from "@/api/employee";
import { imagesApi } from "@/api/images";
import { useFeedback } from "@/context/useFeedback";
import { useFormSubmitGate } from "@/hooks/useFormSubmitGate";
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
import { useNavigate, useParams } from "react-router-dom";

export type EditEmployeeForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isDeleted: boolean;
};

const emptyForm: EditEmployeeForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  isAdmin: false,
  isDeleted: false,
};

type EditSnapshot = EditEmployeeForm & {
  hasNewAvatar: boolean;
};

export const useEditEmployee = () => {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const employeeId = Number(idParam);

  const [form, setForm] = useState<EditEmployeeForm>(emptyForm);
  const [initialData, setInitialData] = useState<EditEmployeeForm>(emptyForm);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [isSelf, setIsSelf] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const avatarObjectUrlRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});

  const values: EditSnapshot = {
    ...form,
    hasNewAvatar: profilePictureFile != null,
  };
  const baseline: EditSnapshot = {
    ...initialData,
    hasNewAvatar: false,
  };
  const { canSubmit } = useFormSubmitGate({
    values,
    baseline,
    isComplete: Object.keys(validateProfileForm(form)).length === 0,
    isBusy: isSaving,
  });

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

    const load = async () => {
      if (!Number.isFinite(employeeId) || employeeId <= 0) {
        setLoadError(t("admin.edit_employee_invalid"));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const [employeeResponse, meResponse] = await Promise.all([
          employeeApi.getEmployee(employeeId),
          employeeApi.getMe(),
        ]);

        if (cancelled) return;

        if (!employeeResponse.success || !employeeResponse.data) {
          setLoadError(
            employeeResponse.errors?.[0] ?? t("admin.edit_employee_load_error"),
          );
          return;
        }

        const employee = employeeResponse.data;
        const next: EditEmployeeForm = {
          firstName: employee.firstName ?? "",
          lastName: employee.lastName ?? "",
          email: employee.email ?? "",
          phone: employee.phone ?? "",
          isAdmin: Boolean(employee.isAdmin),
          isDeleted: Boolean(employee.isDeleted),
        };

        setForm(next);
        setInitialData(next);
        setEmailConfirmed(employee.emailConfirmed);
        setIsSelf(
          meResponse.success &&
            meResponse.data != null &&
            meResponse.data.id === employee.id,
        );
        await loadAvatarById(employee.profilePictureId);
        if (cancelled) revokeAvatarUrl();
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          const apiErrors = err.response?.data?.errors as string[] | undefined;
          setLoadError(
            apiErrors?.[0] ?? t("admin.edit_employee_load_error"),
          );
        } else {
          setLoadError(t("admin.edit_employee_load_error"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      revokeAvatarUrl();
    };
  }, [employeeId, t]);

  const setField = <K extends keyof EditEmployeeForm>(
    key: K,
    value: EditEmployeeForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as keyof ProfileFormErrors];
      return next;
    });
    if (saveError) setSaveError(null);
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
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !Number.isFinite(employeeId)) return;
    setSaveError(null);

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
      const uploadedFile = profilePictureFile;
      const payload: UpdateEmployeeRequest = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: normalizedPhone,
      };

      if (form.isAdmin !== initialData.isAdmin) {
        payload.isAdmin = form.isAdmin;
      }
      if (!isSelf && form.isDeleted !== initialData.isDeleted) {
        payload.isDeleted = form.isDeleted;
      }

      const response = await employeeApi.updateEmployee(
        employeeId,
        payload,
        uploadedFile,
      );

      if (!response.success || !response.data) {
        setSaveError(
          response.errors?.[0] ?? t("admin.edit_employee_save_error"),
        );
        return;
      }

      feedback.success(t("admin.edit_employee_save_success"));
      navigate("/staff/users");
    } catch (err) {
      if (isAxiosError(err)) {
        const apiErrors = err.response?.data?.errors as string[] | undefined;
        setSaveError(
          apiErrors?.[0] ?? t("admin.edit_employee_save_error"),
        );
      } else {
        setSaveError(t("admin.edit_employee_save_error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    setField,
    emailConfirmed,
    isSelf,
    avatarUrl,
    handleAvatarChange,
    isLoading,
    isSaving,
    canSubmit,
    loadError,
    saveError,
    fieldErrors,
    handleSubmit,
    t,
  };
};
