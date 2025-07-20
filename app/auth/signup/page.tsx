'use client';
import Link from 'next/link';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone' && !/^\d*$/.test(value)) {
      // Allow only numbers in phone field
      return;
    }

    setForm({ ...form, [name]: value });
    setError('');
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = form;

    if (!name || name.trim().length < 2) {
      return 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Enter a valid email address.';
    }

    if (!/^\d{9,15}$/.test(phone)) {
      return 'Phone number must be 9 to 15 digits.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    const { confirmPassword, phone, name, ...restForm } = form;
    const updatedForm = { 
      ...restForm, 
      full_name: name,
      phone_number: phone,
      password: confirmPassword, 
      role: 'member' 
    };
  
    try {
      await signup(updatedForm);
      router.push('/auth');
      console.log(updatedForm);
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pattern-hills bg-background text-foreground">
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md border border-border hover-card">
        <h2 className="text-2xl font-bold text-center mb-4 gradient-text">
          Create Your Account
        </h2>
        {error && (
          <div className="text-red-600 text-sm text-center mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/80"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
