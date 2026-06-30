import { useTranslation } from "react-i18next";
import { ScannerFrame } from "./components/ScannerFrame";
import { useCamera } from "@/apps/guest/hooks/use-camera";
import { AccentButton } from "@/ui/AccentButton";
import { FooterStatus } from "./components/FooterStatus";

export const ScanQRCodePage = () => {
  const { t } = useTranslation();
  const { videoRef, isCameraOpen, isLoading, error, toggleCamera } =
    useCamera();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-[var(--bg-primary)]">
      <div className="z-10 flex flex-col items-center w-full max-w-md text-center">
        <header className="mb-12">
          <span className="title title--s title--accent uppercase tracking-widest mb-2 block">
            {t("common.welcome")}
          </span>
          <h1 className="title title--m title--primary px-4">
            {t("common.scan_qr")}
          </h1>
        </header>

        <ScannerFrame isCameraOpen={isCameraOpen} videoRef={videoRef} />

        <AccentButton
          onClick={toggleCamera}
          disabled={isLoading}
          className="mt-8"
        >
          <span>{isCameraOpen ? "" : "📷"}</span>
          {isLoading
            ? "..."
            : isCameraOpen
              ? t("common.close_camera")
              : t("common.open_camera")}
        </AccentButton>

        {error && (
          <p className="mt-3 text-sm text-[var(--error-color)] max-w-[280px]">
            {t(`errors.${error}`)}
          </p>
        )}

        <FooterStatus
          statusLabel={`${t("staff.table_status")}: ${t("common.waiting")}`}
          hintText={t("common.scan_hint")}
        />
      </div>
    </main>
  );
};
