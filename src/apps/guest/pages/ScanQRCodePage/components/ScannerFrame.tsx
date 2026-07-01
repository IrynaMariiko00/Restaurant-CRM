import { QRCodeIcon } from "@/assets/icons/QRCodeIcon";

interface ScannerFrameProps {
  isCameraOpen: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const ScannerFrame = ({ isCameraOpen, videoRef }: ScannerFrameProps) => {
  const corners = [
    "top-4 left-4 border-t-4 border-l-4 rounded-tl-lg",
    "top-4 right-4 border-t-4 border-r-4 rounded-tr-lg",
    "bottom-4 left-4 border-b-4 border-l-4 rounded-bl-lg",
    "bottom-4 right-4 border-b-4 border-r-4 rounded-br-lg",
  ];

  return (
    <div className="relative group">
      <div className="relative w-64 h-64 bg-[var(--bg-light)] rounded-[20px] border border-[var(--border-color)] shadow-inner flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
            isCameraOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          playsInline
          muted
        />
        {!isCameraOpen && (
          <div className="relative z-10">
            <QRCodeIcon />
          </div>
        )}

        {corners.map((cornerClass, index) => (
          <div
            key={index}
            className={`absolute w-8 h-8 border-[var(--color-violet-blue)] z-30 ${cornerClass}`}
          />
        ))}

        <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-violet-blue)] to-transparent shadow-[0_0_15px_var(--color-violet-blue)] z-20 animate-scan" />
      </div>
    </div>
  );
};
