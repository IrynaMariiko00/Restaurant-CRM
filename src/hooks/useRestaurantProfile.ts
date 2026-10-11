import { restaurantApi } from "@/api/restaurant";
import { useImageUrl } from "@/hooks/useImageUrl";
import type { Restaurant } from "@/types/restaurant";
import { useEffect, useState } from "react";

let cachedRestaurant: Restaurant | null = null;
let inflight: Promise<Restaurant | null> | null = null;
const listeners = new Set<() => void>();

function notifyRestaurantProfileListeners() {
  for (const listener of listeners) listener();
}

async function loadRestaurant(): Promise<Restaurant | null> {
  if (cachedRestaurant) return cachedRestaurant;
  if (inflight) return inflight;

  inflight = restaurantApi
    .getRestaurant()
    .then((response) => {
      if (!response.success || !response.data) return null;
      cachedRestaurant = response.data;
      return cachedRestaurant;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function setRestaurantProfileCache(data: Restaurant | null) {
  cachedRestaurant = data;
  inflight = null;
  notifyRestaurantProfileListeners();
}

export function useRestaurantProfile() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    cachedRestaurant,
  );
  const [isLoading, setIsLoading] = useState(!cachedRestaurant);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(!cachedRestaurant);
      const data = await loadRestaurant();
      if (!cancelled) {
        setRestaurant(data);
        setIsLoading(false);
      }
    };

    void run();

    const onUpdate = () => {
      setRestaurant(cachedRestaurant);
      setIsLoading(false);
    };
    listeners.add(onUpdate);

    return () => {
      cancelled = true;
      listeners.delete(onUpdate);
    };
  }, []);

  const logoUrl = useImageUrl(restaurant?.logoId);
  const backgroundUrl = useImageUrl(restaurant?.backgroundImageId);

  return {
    restaurant,
    name: restaurant?.name ?? null,
    logoUrl,
    backgroundUrl,
    isLoading,
  };
}
