// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Загружаем данные о пользователе (например, из localStorage или API)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
