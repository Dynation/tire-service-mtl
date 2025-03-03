import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

const auth = getAuth();

// Типи для контексту
interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();

        // Використовуємо cookies для збереження токена
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        
        // Перевіряємо, чи користувач успішно залогінився
        setUser(currentUser);
        setIsAuthenticated(true);
        

        // Викликаємо API для створення користувача
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              uid: currentUser.uid,
              name: currentUser.displayName || "User",
              email: currentUser.email,
            }),
          });

          if (!response.ok) {
            console.error("Не вдалося створити користувача:", await response.json());
          } else {
            console.log("Користувач успішно створений або вже існує");
          }
        } catch (error) {
          console.error("Помилка при створенні користувача:", error);
        }
      } else {
        localStorage.removeItem("authToken"); // Видаляємо токен, якщо користувач не автентифікований
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // 🔥 Передаємо cookies
      });
  
      if (!response.ok) throw new Error("Failed to sign in");
  
      const { user } = await response.json();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };
  

  const signOutUser = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include", // 🔥 Передаємо cookies
      });
  
      if (!response.ok) throw new Error("Failed to sign out");
  
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

