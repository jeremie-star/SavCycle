"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, Info, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pattern-hills">
      <Header />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-3xl font-bold">{t('home.title')}</h1>
            <p className="text-muted-foreground">{t('home.subtitle')}</p>
          </div>

          {/* Hero visual - stylized representation of tontine */}
          <div className="relative bg-gradient-to-br from-mtn-blue to-primary/80 h-48 rounded-lg mb-8 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2 p-4">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center 
                    ${i === 2 ? 'animate-pulse-slow ring-2 ring-white col-span-1 row-span-1' : ''}`}
                  >
                    <Users className={`${i === 2 ? 'text-white h-8 w-8' : 'text-white/80 h-6 w-6'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white font-medium">{t('home.welcome')}</p>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button asChild className="h-auto py-6" variant="default">
              <Link href="/create-group" className="flex flex-col items-center space-y-2">
                <PlusCircle className="h-6 w-6 mb-1" />
                <span>{t('home.createGroup')}</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-6" variant="outline">
              <Link href="/join-group" className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6 mb-1" />
                <span>{t('home.joinGroup')}</span>
              </Link>
            </Button>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button asChild variant="ghost" className="w-full h-auto p-0">
              <Link href="/about">
                <Card className="w-full hover:bg-muted/50 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <Info className="h-6 w-6 mb-3 text-muted-foreground" />
                    <h3 className="font-medium text-center">{t('home.about')}</h3>
                  </CardContent>
                </Card>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full h-auto p-0">
              <Link href="/ussd">
                <Card className="w-full hover:bg-muted/50 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <Phone className="h-6 w-6 mb-3 text-muted-foreground" />
                    <h3 className="font-medium text-center">{t('home.ussd')}</h3>
                  </CardContent>
                </Card>
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}