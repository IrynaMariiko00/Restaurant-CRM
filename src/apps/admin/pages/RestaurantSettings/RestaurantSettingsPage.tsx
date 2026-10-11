import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { ProfileTextField } from "@/apps/staff/pages/EmployeeProfilePage/components/ProfileTextField";
import { FormSelect } from "@/ui/FormSelect";
import { PageLoader } from "@/ui/PageLoader";
import type { RestaurantRegion } from "@/types/restaurant";
import { RestaurantImageField } from "./components/RestaurantImageField";
import { useRestaurantSettings } from "./hooks/useRestaurantSettings";

const REGION_OPTIONS: { value: RestaurantRegion; labelKey: string }[] = [
  { value: "UKRAINE", labelKey: "admin.restaurant_region_ukraine" },
  { value: "EUROPE", labelKey: "admin.restaurant_region_europe" },
];

export const RestaurantSettingsPage = () => {
  const {
    restaurant,
    name,
    defaultRegion,
    logoPreviewUrl,
    backgroundPreviewUrl,
    canClearLogo,
    canClearBackground,
    fieldErrors,
    loadError,
    submitError,
    isLoading,
    isSubmitting,
    handleNameChange,
    handleRegionChange,
    handleLogoChange,
    handleBackgroundChange,
    handleSubmit,
    t,
  } = useRestaurantSettings();

  return (
    <AdminPageShell
      title={t("admin.restaurant_title")}
      subtitle={t("admin.restaurant_desc")}
    >
      {isLoading ? (
        <PageLoader />
      ) : loadError ? (
        <p className="text-center text-sm text-[var(--error-color)]">
          {loadError}
        </p>
      ) : (
        <div className="restaurant-settings">
          <AuthFormCard
            onSubmit={handleSubmit}
            submitText={
              isSubmitting
                ? t("admin.restaurant_saving")
                : t("admin.restaurant_save")
            }
            isLoading={isSubmitting}
            error={submitError}
            className="restaurant-settings__card"
            submitClassName="restaurant-settings__submit"
          >
            <div className="restaurant-settings__top">
              <RestaurantImageField
                id="restaurant-logo"
                label={t("admin.restaurant_logo")}
                previewUrl={logoPreviewUrl}
                error={fieldErrors.logo}
                variant="logo"
                canClear={canClearLogo}
                onChange={handleLogoChange}
              />

              <div className="restaurant-settings__fields">
                <ProfileTextField
                  id="restaurant-name"
                  label={t("admin.restaurant_name")}
                  value={name}
                  error={fieldErrors.name ? t(fieldErrors.name) : null}
                  onChange={handleNameChange}
                />

                <div className="form-field">
                  <label className="form-label" htmlFor="restaurant-region">
                    {t("admin.restaurant_region")}
                  </label>
                  <FormSelect
                    id="restaurant-region"
                    value={defaultRegion}
                    placeholder={t("admin.restaurant_region")}
                    options={REGION_OPTIONS.map((option) => ({
                      value: option.value,
                      label: t(option.labelKey),
                    }))}
                    onChange={(value) =>
                      handleRegionChange(value as RestaurantRegion)
                    }
                  />
                </div>

                {restaurant && (
                  <ul className="restaurant-settings__meta">
                    <li>
                      <span>{t("admin.restaurant_language")}</span>
                      <strong>{restaurant.language}</strong>
                    </li>
                    <li>
                      <span>{t("admin.restaurant_currency")}</span>
                      <strong>{restaurant.currency}</strong>
                    </li>
                    <li>
                      <span>{t("admin.restaurant_payment")}</span>
                      <strong>{restaurant.paymentProvider}</strong>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <RestaurantImageField
              id="restaurant-background"
              label={t("admin.restaurant_background")}
              previewUrl={backgroundPreviewUrl}
              error={fieldErrors.backgroundImage}
              variant="background"
              canClear={canClearBackground}
              onChange={handleBackgroundChange}
            />
          </AuthFormCard>
        </div>
      )}
    </AdminPageShell>
  );
};
