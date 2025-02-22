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
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.warn("Token not found in localStorage");
          setUser(null);
          return;
        }

        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Використовуємо токен
          },
        });

        if (response.ok) {
          const { user: fetchedUser } = await response.json();
          setUser(fetchedUser || null);
        } else {
          console.warn(`Failed to fetch user: ${response.status}`);
          setUser(null);
        }
      } catch (error) {
        console.error("Error while fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}
