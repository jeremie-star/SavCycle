"use client";

import { useEffect, useState } from 'react';
import { Home, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';


interface DecodedToken {
  groupId?: string;
  [key: string]: any;
}

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      const uid = decoded.uid || decoded.id || decoded.userId;

      if (uid) {
        setUserId(uid);

        // Fetch group ID associated with the user
        fetch('http://localhost:3001/api/members/my-group', {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`, 
               },
             })
          .then(res => res.json())
          .then(data => {
            if (data.group_id) {
              setGroupId(data.group_id);
            }
          })
          .catch(err => {
            console.error("Failed to fetch group ID", err);
            toast.error("Failed to fetch group ID");
          });
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      toast.error("Invalid token");
    }
  }
}, []);


  const navItems = [
    {
      name: t('nav.home'),
      href: '/',
      icon: Home,
    },
    ...(userId && groupId
      ? [{
          name: t('nav.dashboard'),
          href: `/dashboard/${groupId}`,
          icon: LayoutDashboard,
        }]
      : []),
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
