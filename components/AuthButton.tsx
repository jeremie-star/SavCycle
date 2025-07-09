'use client';

import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/auth')}
      className="rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition font-semibold shadow-md"
    >
      Sign In
    </button>
  );
}
