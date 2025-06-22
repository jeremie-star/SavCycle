"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BellRing, Globe, Moon, Smartphone } from 'lucide-react';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Header title="Settings" />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language & Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                </div>
                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="rw">Kinyarwanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BellRing className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded before payments are due</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Version</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MTN MoKash</span>
                <Badge>Official</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline Support</span>
                <Badge variant="outline" className="text-success">Enabled</Badge>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground text-center">
                <p>&copy; {new Date().getFullYear()} MTN Rwanda. All rights reserved.</p>
                <p className="mt-1">Powered by MTN MoKash</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}