import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import auth from "../lib/firebaseAuth";

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

  // Відслідковуємо стан користувача через Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const verifiedUser = await verifyToken(token); // Перевірка через серверний API

        if (verifiedUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          await createUser(currentUser); // Створення користувача у базі даних через API
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Вхід через серверний API
  const signIn = async () => {
    try {
      const response = await fetch("/api/auth/signin", { method: "POST" });
      if (response.ok) {
        window.location.reload(); // Перезавантаження після входу
      } else {
        throw new Error("Помилка входу");
      }
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  // Вихід через серверний API
  const signOutUser = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        throw new Error("Помилка виходу");
      }
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

// Хук для доступу до контексту
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Допоміжні функції для серверних API
const verifyToken = async (token: string) => {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

const createUser = async (currentUser: User) => {
  try {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: currentUser.uid,
        name: currentUser.displayName || "Anonymous",
        email: currentUser.email || "",
      }),
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
