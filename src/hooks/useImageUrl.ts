import { imagesApi } from "@/api/images";
import { useEffect, useState } from "react";

export function useImageUrl(imageId?: number | null) {
  const [url, setUrl] = useState<string | null>(null);
  const validId = imageId && imageId > 0 ? imageId : null;

  useEffect(() => {
    if (!validId) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    const load = async () => {
      await Promise.resolve();
      if (cancelled) return;
      setUrl(null);

      try {
        const blob = await imagesApi.getImage(validId);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch {
        if (!cancelled) setUrl(null);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [validId]);

  return validId ? url : null;
}
