import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { useStaffHomePath } from "@/hooks/useStaffHomePath";
import { ProfileForm } from "./components/ProfileForm";
import { useEmployeeProfile } from "./hooks/useEmployeeProfile";

export const EmployeeProfilePage = () => {
  const homePath = useStaffHomePath();
  const {
    form,
    setField,
    isEditing,
    startEditing,
    cancelEditing,
    emailConfirmed,
    avatarUrl,
    handleAvatarChange,
    isLoading,
    isSaving,
    loadError,
    saveError,
    success,
    fieldErrors,
    handleSubmit,
    t,
  } = useEmployeeProfile();

  return (
    <AuthLayout
      title={t("staff.profile_title")}
      subtitle={
        isEditing ? t("staff.profile_edit_subtitle") : t("staff.profile_subtitle")
      }
      footer={
        <Link
          to={homePath}
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("staff.back_to_home")}
        </Link>
      }
    >
      {isLoading ? (
        <p className="text-center text-sm text-[var(--secondary-text)]">
          {t("staff.profile_loading")}
        </p>
      ) : loadError ? (
        <p className="text-center text-sm text-[var(--error-color)]">
          {loadError}
        </p>
      ) : (
        <AuthFormCard
          onSubmit={handleSubmit}
          hideSubmit={!isEditing}
          submitText={
            isSaving ? t("staff.profile_saving") : t("staff.profile_save")
          }
          isLoading={isSaving}
          error={saveError}
        >
          <ProfileForm
            form={form}
            setField={setField}
            isEditing={isEditing}
            emailConfirmed={emailConfirmed}
            avatarUrl={avatarUrl}
            fieldErrors={fieldErrors}
            onAvatarChange={handleAvatarChange}
          />

          <div className="mt-2 flex flex-col gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={startEditing}
                className="btn-accent w-full"
              >
                {t("common.edit")}
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelEditing}
                className="btn-ghost w-full"
                disabled={isSaving}
              >
                {t("common.cancel")}
              </button>
            )}
          </div>

          {success && !isEditing && (
            <p className="mt-2 text-center text-sm text-[var(--success-color)]">
              {success}
            </p>
          )}
        </AuthFormCard>
      )}
    </AuthLayout>
  );
};
