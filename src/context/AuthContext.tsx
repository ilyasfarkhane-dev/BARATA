import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'dashboard_auth';
const DEFAULT_PASSWORD = 'admin';

function getStoredAuth(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function setStoredAuth(value: boolean) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, 'true');
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function getExpectedPassword(): string {
  return import.meta.env.VITE_DASHBOARD_PASSWORD ?? DEFAULT_PASSWORD;
}

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth);

  useEffect(() => {
    setStoredAuth(isAuthenticated);
  }, [isAuthenticated]);

  const login = useCallback((password: string): boolean => {
    const expected = getExpectedPassword();
    if (password === expected) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
