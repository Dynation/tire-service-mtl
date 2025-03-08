import { useState, useEffect } from "react";

interface User {
  uid: string;
  displayName: string | null;
  email: string;
  picture?: string;
}

export default function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        console.log("🔥 User fetched:", data); // ✅ Дебаг
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}
