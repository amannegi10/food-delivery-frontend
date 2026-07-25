import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fd_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (authResponse) => {
    localStorage.setItem('fd_token', authResponse.token);
    const userInfo = { email: authResponse.email, role: authResponse.role };
    // The auth response doesn't include the numeric user id, so we look it
    // up once at login/register time and cache it — order-service needs it.
    return authApi.getUserByEmail(authResponse.email).then((full) => {
      const merged = { ...userInfo, id: full.id, name: full.name };
      localStorage.setItem('fd_user', JSON.stringify(merged));
      setUser(merged);
      return merged;
    });
  };

  const login = useCallback((email, password) => {
    return authApi.login({ email, password }).then(persist);
  }, []);

  const register = useCallback((name, email, password) => {
    return authApi.register({ name, email, password }).then(persist);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fd_token');
    localStorage.removeItem('fd_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
