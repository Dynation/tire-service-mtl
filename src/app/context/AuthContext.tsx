import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

const auth = getAuth();

// Типи для контексту
interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  signIn: () => Promise<void>;
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
        localStorage.setItem("authToken", token); // Зберігаємо токен
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

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      localStorage.setItem("authToken", token); // Зберігаємо токен після входу
      setUser(result.user);
      setIsAuthenticated(true);

      console.log("Успішний вхід! Токен збережено:", token);
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("authToken"); // Видаляємо токен при виході
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Помилка виходу:", error);
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

