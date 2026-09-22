import { useCamera } from "@/apps/guest/hooks/use-camera";
import { FooterStatus } from "./components/FooterStatus";
import { ScannerFrame } from "./components/ScannerFrame";
import { GuestEntryNav } from "@/pages/AboutPage/GuestEntryNav";
import { parseDiningTableUuid } from "@/shared/diningTables/parseDiningTableUuid";
import { AccentButton } from "@/ui/AccentButton";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BarcodeDetectorLike = {
  detect: (
    source: ImageBitmapSource,
  ) => Promise<Array<{ rawValue?: string }>>;
};

function getBarcodeDetector():
  | (new (options?: { formats?: string[] }) => BarcodeDetectorLike)
  | null {
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
      <div className="z-10 flex w-full max-w-md flex-col items-center text-center">
        <header className="mb-12">
          <span className="title title--s title--accent mb-2 block uppercase tracking-widest">
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
          <p className="mt-3 max-w-[280px] text-sm text-[var(--error-color)]">
            {t("common.camera_error")}
          </p>
        )}

        <FooterStatus
          statusLabel={`${t("staff.table_status")}: ${t("common.waiting")}`}
          hintText={t("common.scan_hint")}
        />

        <GuestEntryNav />
      </div>
    </main>
  );
};
