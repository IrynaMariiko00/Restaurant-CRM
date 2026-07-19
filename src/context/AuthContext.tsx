import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/api/auth";

const TOKEN_KEY = "token";
const IS_ADMIN_KEY = "isAdmin";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialAuth(): Pick<AuthState, "isAuthenticated" | "isAdmin"> {
  return {
    isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
    isAdmin: localStorage.getItem(IS_ADMIN_KEY) === "true",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState(readInitialAuth);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (!response.success) {
        throw new Error(response.message ?? "login_failed");
      }

      const isAdmin = await authApi.checkRole();
      localStorage.setItem(TOKEN_KEY, "session");
      localStorage.setItem(IS_ADMIN_KEY, String(isAdmin));
      setAuth({ isAuthenticated: true, isAdmin });

      return { isAdmin };
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(IS_ADMIN_KEY);
      setAuth({ isAuthenticated: false, isAdmin: false });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(IS_ADMIN_KEY);
      setAuth({ isAuthenticated: false, isAdmin: false });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      isLoading,
      login,
      logout,
    }),
    [auth, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
