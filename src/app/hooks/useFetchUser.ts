import { useState, useEffect } from "react";

interface User {
  uid: string;
  displayName: string | null;
  email: string;
}

export default function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include", // ✅ Додає `httpOnly` cookie автоматично!
        });

        if (!response.ok) {
          console.warn(`Failed to fetch user: ${response.status}`);
          setUser(null);
          return;
        }

        const { user: fetchedUser } = await response.json();
        setUser(fetchedUser || null);
      } catch (error) {
        console.error("Error while fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}
