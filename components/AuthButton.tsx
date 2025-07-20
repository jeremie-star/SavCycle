"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const { logout } = useAuth();

  const refLogout = () =>{
    logout();
    router.push('auth');
  }

  return (
    <>
      {!token ? (
        <button
          onClick={() => router.push("/auth")}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition font-semibold shadow-md"
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={() => refLogout()}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition font-semibold shadow-md"
        >
          Logout
        </button>
      )}
    </>
  );
}
