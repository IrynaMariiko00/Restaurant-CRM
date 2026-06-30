import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ukTranslations from "./locales/uk.json";
import enTranslations from "./locales/en.json";

export interface Translations {
  common: {
    welcome: string;
    scan_qr: string;
    scan_hint: string;
    open_camera: string;
    close_camera: string;
    camera_error: string;
    waiting: string;
  };
  guest: {
    cart: string;
    total: string;
    add_to_order: string;
  };
  staff: {
    login: string;
    login_subtitle: string;
    email: string;
    password: string;
    logging_in: string;
    login_error: string;
    logout: string;
    guest_hint: string;
    guest_link: string;
    welcome_waiter: string;
    welcome_waiter_desc: string;
    welcome_admin: string;
    welcome_admin_desc: string;
    table_status: string;
  };
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: ukTranslations },
      en: { translation: enTranslations },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
