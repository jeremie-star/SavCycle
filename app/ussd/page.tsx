"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Send } from 'lucide-react';

type ScreenState = {
  content: string[];
  expectingText: boolean;
  maxLength?: number;
};

export default function UssdSimulator() {
  const { t } = useLanguage();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({
    content: [
      t('ussd.menu'),
      t('ussd.create'),
      t('ussd.join'),
      t('ussd.contribute'),
      t('ussd.status'),
      t('ussd.exit'),
      "Reply:",
    ],
    expectingText: false
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (currentScreen.expectingText) {
      if (currentScreen.maxLength && value.length > currentScreen.maxLength) return;
      setInput(value);
    } else {
      // Only allow single digits for menu selection
      if (value.length <= 1 && /^[0-9]*$/.test(value)) {
        setInput(value);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "") return;

    let newScreen: ScreenState = {
      content: [],
      expectingText: false
    };

    if (currentScreen.expectingText) {
      if (currentScreen.content[0] === "Create Group") {
        newScreen = {
          content: [
            "Group name set to:",
            input,
            "",
            "Enter contribution amount (RWF):",
          ],
          expectingText: true,
          maxLength: 7 // For amount input
        };
      } else if (currentScreen.content[0] === "Join Group") {
        newScreen = {
          content: [
            "Joining group...",
            "Group code: " + input,
            "",
            "1. Confirm",
            "0. Cancel"
          ],
          expectingText: false
        };
      }
    } else {
      switch (input) {
        case "1":
          newScreen = {
            content: [
              "Create Group",
              "Enter group name:",
              "(e.g., Family Savings)"
            ],
            expectingText: true,
            maxLength: 30 // Allow reasonable group name length
          };
          break;
        case "2":
          newScreen = {
            content: [
              "Join Group",
              "Enter group code:",
            ],
            expectingText: true,
            maxLength: 6
          };
          break;
        case "3":
          newScreen = {
            content: [
              "Make Contribution",
              "1. Weekly contribution: 5,000 RWF",
              "2. Pay another amount",
              "Reply:",
            ],
            expectingText: false
          };
          break;
        case "4":
          newScreen = {
            content: [
              "Group Status",
              "Family Savings",
              "Next payment: May 21",
              "Your turn: Jun 11",
              "0. Back"
            ],
            expectingText: false
          };
          break;
        case "0":
          newScreen = {
            content: [
              t('ussd.menu'),
              t('ussd.create'),
              t('ussd.join'),
              t('ussd.contribute'),
              t('ussd.status'),
              t('ussd.exit'),
              "Reply:",
            ],
            expectingText: false
          };
          break;
        default:
          newScreen = {
            content: [
              "Invalid option",
              "1. Back to main menu",
              "0. Exit",
            ],
            expectingText: false
          };
      }
    }
    
    setCurrentScreen(newScreen);
    setInput("");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <Header title={t('ussd.title')} showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('ussd.title')}</CardTitle>
            <CardDescription>
              Simulated USSD interface for feature phone users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mx-auto max-w-xs">
              <div className="ussd-screen">
                <div className="mb-2 pb-2 border-b border-green-600/30 text-center">
                  *123*5#
                </div>
                {currentScreen.content.map((line, index) => (
                  <div key={index} className="my-1">
                    {line}
                  </div>
                ))}
                {input && (
                  <div className="mt-1 text-yellow-400">
                    {"> "}{input}
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <Input
                  value={input}
                  onChange={handleInput}
                  className="text-center font-mono"
                  placeholder={currentScreen.expectingText ? "Enter text..." : "Enter option"}
                  maxLength={currentScreen.maxLength}
                  type={currentScreen.expectingText ? "text" : "tel"}
                />
                <Button type="submit" size="icon" disabled={!input}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div className="bg-muted/30 border rounded-md p-3 mt-6">
              <h3 className="font-medium text-sm mb-2">USSD Access Instructions</h3>
              <p className="text-xs mb-2">
                Access the Ikimina service from any phone by dialing:
              </p>
              <p className="text-base font-mono text-center font-bold mb-2">
                *123*5#
              </p>
              <p className="text-xs">
                Works on all phones, even without internet access. Follow the on-screen instructions to create or join groups, make contributions, and check your status.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}