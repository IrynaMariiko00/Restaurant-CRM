import { employeeApi } from "@/api/employee";
import { useEffect, useState } from "react";

type StaffName = {
  firstName: string;
  lastName: string;
};

export const useStaffWelcome = () => {
  const [name, setName] = useState<StaffName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      try {
        const response = await employeeApi.getMe();
        if (cancelled) return;

        if (response.success && response.data) {
          setName({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          });
        }
      } catch {
        // Fallback greeting if profile fails to load.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { name, isLoading };
};
