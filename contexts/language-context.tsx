"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'rw';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Translation dictionaries
const translations = {
  en: {
    'app.title': 'Ikimina',
    'home.title': 'Welcome to Ikimina',
    'home.subtitle': 'Create or join a digital savings group',
    'home.createGroup': 'Create Group',
    'home.joinGroup': 'Join Group',
    'home.about': 'About Ikimina',
    'home.ussd': 'USSD Access',
    'home.welcome': 'Welcome',
    'group.create.title': 'Create a New Group',
    'group.create.name': 'Group Name',
    'group.create.amount': 'Contribution Amount (RWF)',
    'group.create.frequency': 'Contribution Frequency',
    'group.create.members': 'Number of Members',
    'group.create.payment': 'Payment Order',
    'group.create.start': 'Start Date',
    'group.create.submit': 'Create Group',
    'group.join.title': 'Join a Group',
    'group.join.code': 'Group Code',
    'group.join.submit': 'Join Group',
    'dashboard.title': 'My Ikimina',
    'dashboard.progress': 'Progress',
    'dashboard.nextPayment': 'Next Payment',
    'dashboard.upcomingPayouts': 'Upcoming Payouts',
    'dashboard.contribution': 'Your Contribution',
    'dashboard.make': 'Make Contribution',
    'dashboard.history': 'History',
    'payment.title': 'Make Contribution',
    'payment.amount': 'Amount (RWF)',
    'payment.method': 'Payment Method',
    'payment.submit': 'Pay Now',
    'payment.success': 'Payment Successful',
    'ussd.title': 'USSD Menu',
    'ussd.menu': 'Tontine',
    'ussd.create': '1. Create Group',
    'ussd.join': '2. Join Group',
    'ussd.contribute': '3. Contribute',
    'ussd.status': '4. Check Status',
    'ussd.exit': '0. Exit',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.upcoming': 'Upcoming',
  },
  rw: {
    'app.title': 'Ikimina',
    'home.title': 'Murakaza neza kuri Ikimina',
    'home.subtitle': 'Kora cyangwa winjire mu itsinda ryo kuzigama',
    'home.createGroup': 'Kora Itsinda',
    'home.joinGroup': 'Injira mu Itsinda',
    'home.about': 'Ibyerekeye Ikimina',
    'home.ussd': 'USSD',
    'home.welcome': 'Murakaza neza',
    'group.create.title': 'Kora Itsinda Rishya',
    'group.create.name': "Izina ry'Itsinda",
    'group.create.amount': "Umusanzu (RWF)",
    'group.create.frequency': "Inshuro y'Umusanzu",
    'group.create.members': "Umubare w'Abanyamuryango",
    'group.create.payment': "Urwego rwo Kwishyura",
    'group.create.start': "Itariki yo Gutangira",
    'group.create.submit': "Kora Itsinda",
    'group.join.title': "Injira mu Itsinda",
    'group.join.code': "Kode y'Itsinda",
    'group.join.submit': "Injira mu Itsinda",
    'dashboard.title': "Ikimina Cyanjye",
    'dashboard.progress': "Intambwe",
    'dashboard.nextPayment': "Ubwishyu Bukurikira",
    'dashboard.upcomingPayouts': "Ibituruka",
    'dashboard.contribution': "Umusanzu Wawe",
    'dashboard.make': "Tanga Umusanzu",
    'dashboard.history': "Amateka",
    'payment.title': "Tanga Umusanzu",
    'payment.amount': "Umubare (RWF)",
    'payment.method': "Uburyo bwo Kwishyura",
    'payment.submit': "Ishyura Nonaha",
    'payment.success': "Ubwishyu Bwagenze Neza",
    'ussd.title': "Menu ya USSD",
    'ussd.menu': "MoKash Ikimina",
    'ussd.create': "1. Kora Itsinda",
    'ussd.join': "2. Injira mu Itsinda",
    'ussd.contribute': "3. Tanga Umusanzu",
    'ussd.status': "4. Reba Imimerere",
    'ussd.exit': "0. Sohoka",
    'nav.home': "Ahabanza",
    'nav.dashboard': "Ikimina",
    'nav.settings': "Igenamiterere",
    'status.completed': "Byarangiye",
    'status.pending': "Birimo Gutegerezwa",
    'status.upcoming': "Bizaza",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check if user has a language preference stored
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'rw')) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    // Return translation or key if not found
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}