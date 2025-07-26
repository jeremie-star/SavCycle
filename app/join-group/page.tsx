"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function JoinGroup() {
  const router = useRouter();
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '', '']);

  const handleChange = (i: number, val: string) => {
    const updated = [...codeInputs];
    updated[i] = val.toUpperCase();
    setCodeInputs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const groupCode = codeInputs.join('');
  if (groupCode.length !== 6) {
    toast.error('Please enter a valid 6-digit group code');
    return;
  }

  const token = localStorage.getItem('token'); 

  if (!token) {
    toast.error('You must be logged in to join a group.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/api/groups/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ group_code: groupCode }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Successfully joined the group');

      setTimeout(() => {
        // Redirect to the group's dashboard
        router.push(`/dashboard/${data.group_id}`);
      }, 1000);
    } else {
      toast.error(data.error || 'Failed to join group');
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
  }
};
  // Back button handler
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <Header title="Join Group" showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Join an Ikimina Group</CardTitle>
            <CardDescription>
              Enter the invitation code shared by the group creator
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Group Code</Label>
                <div className="flex space-x-2">
                  {codeInputs.map((val, i) => (
                    <Input
                      key={i}
                      className="h-12 text-center text-lg"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleChange(i, e.target.value)}
                      required
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Join Group</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}