'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withGuest from '@/components/withGuest';
import { toast } from 'sonner';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: any) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:3001/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // Optional: save token
      localStorage.setItem('token', data.token);
      router.push('/');
      toast.success('Login successful', {
        description: 'Welcome back.',
        duration: 5000,
      });
    } else {
      toast.error(data.message || 'Login failed');
      console.error('Login error:', data);
    }
  } catch (error) {
    console.error('Sign in error:', error);
    toast.error('Sign in failed. Please try again.');
  }
};

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background pattern-hills text-foreground relative">

      {/* Go back arrow to Home */}
      <button
        onClick={goHome}
        className="absolute top-4 left-4 rounded-full w-10 h-10 flex items-center justify-center border border-border bg-muted/50 hover:bg-muted transition"
        aria-label="Go back home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="bg-card text-card-foreground w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-md border border-border hover-card">
        <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
          Welcome to Ikimina
        </h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default withGuest(SignInPage);

