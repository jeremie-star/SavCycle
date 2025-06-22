"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function JoinGroup() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally, we'd validate the group code here
    // For demo purposes, redirect to dashboard
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <Header title={t('group.join.title')} showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('group.join.title')}</CardTitle>
            <CardDescription>
              Enter the invitation code to join an existing Ikimina group
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('group.join.code')}</Label>
                <div className="flex space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <Input 
                      key={i}
                      className="h-12 text-center text-lg"
                      maxLength={1}
                      required
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  The group code was shared by the group creator
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">{t('group.join.submit')}</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}