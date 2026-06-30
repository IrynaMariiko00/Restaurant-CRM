import { useState, useCallback, useRef, useEffect } from "react";

export const useCamera = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraOpen(true);
    } catch {
      setError("CAMERA_ERROR");
      stopCamera();
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  const toggleCamera = useCallback(() => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      startCamera().catch((err) => {
        console.error("Failed to start camera:", err);
      });
    }
  }, [isCameraOpen, startCamera, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    isCameraOpen,
    isLoading,
    error,
    toggleCamera,
    stopCamera,
  };
};
