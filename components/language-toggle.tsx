"use client";

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'rw' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center space-x-1 rounded-full h-8 px-3"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{language === 'en' ? 'RW' : 'EN'}</span>
    </Button>
  );
}