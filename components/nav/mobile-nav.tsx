"use client";

import { Home, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t('nav.home'),
      href: '/',
      icon: Home,
    },
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="grid h-full grid-cols-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-700",
              pathname === item.href 
                ? "text-primary dark:text-primary" 
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 mb-1",
              pathname === item.href 
                ? "text-primary" 
                : "text-gray-500 dark:text-gray-400"
            )} />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}