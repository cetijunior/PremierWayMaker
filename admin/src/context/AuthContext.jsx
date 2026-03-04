import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveToken = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  // DEMO: Bypass auth for client preview – restore with: const isAuthenticated = !!token;
  const isAuthenticated = true; // !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
