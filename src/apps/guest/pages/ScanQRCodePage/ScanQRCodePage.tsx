import { useCamera } from "@/apps/guest/hooks/use-camera";
import { FooterStatus } from "./components/FooterStatus";
import { ScannerFrame } from "./components/ScannerFrame";
import { GuestEntryNav } from "@/pages/AboutPage/GuestEntryNav";
import { useRestaurantProfile } from "@/hooks/useRestaurantProfile";
import { parseDiningTableUuid } from "@/shared/diningTables/parseDiningTableUuid";
import { AccentButton } from "@/ui/AccentButton";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

function getBarcodeDetector():
  (new (options?: { formats?: string[] }) => BarcodeDetectorLike) | null {
  const ctor = (
    window as Window & {
      BarcodeDetector?: new (options?: {
        formats?: string[];
      }) => BarcodeDetectorLike;
    }
  ).BarcodeDetector;
  return ctor ?? null;
}

export const ScanQRCodePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { name, logoUrl, backgroundUrl } = useRestaurantProfile();
  const { videoRef, isCameraOpen, isLoading, error, toggleCamera, stopCamera } =
    useCamera();
  const handledRef = useRef(false);

  const goToTable = useCallback(
    (raw: string) => {
      const uuid = parseDiningTableUuid(raw);
      if (!uuid) return;
      handledRef.current = true;
      stopCamera();
      navigate(`/join?uuid=${encodeURIComponent(uuid)}`);
    },
    [navigate, stopCamera],
  );

  useEffect(() => {
    if (!isCameraOpen) {
      handledRef.current = false;
      return;
    }

    const Detector = getBarcodeDetector();
    if (!Detector) return;

    let cancelled = false;
    let detector: BarcodeDetectorLike | null = null;
    let raf = 0;

    try {
      detector = new Detector({ formats: ["qr_code"] });
    } catch {
      return;
    }

    const tick = async () => {
      if (cancelled || handledRef.current) return;
      const video = videoRef.current;
      if (
        video &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        detector
      ) {
        try {
          const codes = await detector.detect(video);
          const raw = codes[0]?.rawValue;
          if (raw) {
            goToTable(raw);
            return;
          }
        } catch {
          // keep scanning
        }
      }
      raf = window.requestAnimationFrame(() => {
        void tick();
      });
    };

    raf = window.requestAnimationFrame(() => {
      void tick();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [goToTable, isCameraOpen, videoRef]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6">
      {backgroundUrl && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
      )}

      <div className="z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="flex w-full flex-col items-center rounded-[1.75rem] border border-[color-mix(in_srgb,var(--border-color),transparent_40%)] bg-[color-mix(in_srgb,var(--bg-primary),transparent_52%)] px-5 py-6 shadow-[0_12px_40px_color-mix(in_srgb,var(--color-black,#000),transparent_78%)] backdrop-blur-sm sm:px-7 sm:py-7">
          <header className="mb-8 flex flex-col items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="mb-3 h-16 w-16 rounded-full border-2 border-white bg-white object-contain shadow-md"
              />
            ) : null}
            <span className="title title--s title--accent mb-2 block !font-black uppercase tracking-widest">
              {name ?? t("common.welcome")}
            </span>
            <h1 className="title title--m title--primary px-2 font-black">
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
            <p className="mt-3 max-w-[280px] text-sm text-[var(--error-color)]">
              {t("common.camera_error")}
            </p>
          )}

          <FooterStatus
            statusLabel={`${t("staff.table_status")}: ${t("common.waiting")}`}
            hintText={t("common.scan_hint")}
          />
        </div>

        <GuestEntryNav />
      </div>
    </main>
  );
};
