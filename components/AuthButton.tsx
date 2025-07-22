'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token presence in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignInClick = () => {
    router.push("/auth");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push("/");
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogoutClick}
        className="rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition font-semibold shadow-md"
      >
        Logout
      </button>
    );
  }

  return (
    <button
      onClick={handleSignInClick}
      className="rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition font-semibold shadow-md"
    >
      Sign In
    </button>
  );
}
