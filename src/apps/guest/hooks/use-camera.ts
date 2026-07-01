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

  const attachStream = useCallback(async () => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    await video.play();
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
      setIsCameraOpen(true);
    } catch {
      setError("CAMERA_ERROR");
      stopCamera();
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    if (!isCameraOpen) return;
    attachStream().catch(() => setError("CAMERA_ERROR"));
  }, [isCameraOpen, attachStream]);

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
