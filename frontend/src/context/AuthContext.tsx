import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  login: (token: string, role: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem('user');
    if (storedValue) {
      const data = JSON.parse(storedValue);
      setToken(data.token);
      setRole(data.role);
      setUsername(data.username);
    }
  }, [])

  const login = (token: string, role: string, username: string) => {
    setToken(token);
    setRole(role);
    setUsername(username)

    localStorage.setItem('user', JSON.stringify({token, role, username}));
  }

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);

    localStorage.removeItem('user');
  }

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  return ( 
    <AuthContext.Provider value={{ token, role, username, login, logout, isAuthenticated, isAdmin }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
