"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { GroupContributionChart } from '@/components/dashboard/contribution-chart';
import { PaymentHistory } from '@/components/dashboard/payment-history';
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const { t } = useLanguage();

  // Demo group members (replace with real data as needed)
  const groupMembers = [
    { name: 'You', status: 'paid', isYou: true },
    { name: 'Claudine', status: 'paid' },
    { name: 'Jean', status: 'pending' },
    { name: 'Marie', status: 'paid' },
    { name: 'Pascal', status: 'pending' },
    { name: 'Diane', status: 'paid' },
  ];

  // Payout order logic
  const [payoutOrderType, setPayoutOrderType] = useState<'random' | 'fixed' | 'need'>('random');
  const [fixedQueue, setFixedQueue] = useState(groupMembers.map(m => m.name));
  const [randomQueue, setRandomQueue] = useState<string[]>([]);
  const [needPerson, setNeedPerson] = useState<string | null>(null);

  // Shuffle helper
  function shuffle(array: string[]) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Update random queue when needed
  useEffect(() => {
    if (payoutOrderType === 'random') {
      setRandomQueue(shuffle(groupMembers.map(m => m.name)));
    }
  }, [payoutOrderType]);

  return (
    <div className="min-h-screen">
      <Header title={t('dashboard.title')} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <div className="space-y-6">
          {/* Payout Order Type Switcher */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Order</CardTitle>
              <CardDescription>
                Choose how the payout order is determined for this group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button variant={payoutOrderType === 'random' ? 'default' : 'outline'} onClick={() => setPayoutOrderType('random')}>Random Draw</Button>
                <Button variant={payoutOrderType === 'fixed' ? 'default' : 'outline'} onClick={() => setPayoutOrderType('fixed')}>Fixed</Button>
                <Button variant={payoutOrderType === 'need' ? 'default' : 'outline'} onClick={() => setPayoutOrderType('need')}>By Need</Button>
              </div>
              {/* Show queue/order based on type */}
              {payoutOrderType === 'random' && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Randomly generated payout queue:</p>
                  <ol className="list-decimal ml-4">
                    {randomQueue.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ol>
                  <Button size="sm" className="mt-2" onClick={() => setRandomQueue(shuffle(groupMembers.map(m => m.name)))}>Reshuffle</Button>
                </div>
              )}
              {payoutOrderType === 'fixed' && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Fixed payout queue:</p>
                  <ol className="list-decimal ml-4">
                    {fixedQueue.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ol>
                  {/* In a real app, allow drag-and-drop or editing order here */}
                </div>
              )}
              {payoutOrderType === 'need' && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Select the member who needs the payout this round:</p>
                  <select
                    className="border rounded px-2 py-1"
                    value={needPerson || ''}
                    onChange={e => setNeedPerson(e.target.value)}
                  >
                    <option value="" disabled>Select member</option>
                    {groupMembers.map((m, idx) => (
                      <option key={idx} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  {needPerson && <div className="mt-2">Selected: <b>{needPerson}</b></div>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Family Savings Group</CardTitle>
                <Badge variant="outline" className="capitalize">Weekly</Badge>
              </div>
              <CardDescription>6 members • 5,000 RWF per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{t('dashboard.progress')}</span>
                  <span className="font-medium">4/24 weeks</span>
                </div>
                <Progress value={16.67} className="h-2" />
                
                <div className="bg-muted/40 rounded-lg p-3 flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{t('dashboard.nextPayment')}</p>
                      <p className="text-xs text-muted-foreground">Sunday, May 21</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Remind</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Status */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <span className="bg-primary/10 p-1.5 rounded-full mr-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </span>
                {t('dashboard.contribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">5,000 RWF</p>
                  <p className="text-xs text-muted-foreground">Paid for this week</p>
                </div>
                <Button asChild>
                  <Link href="/payment">{t('dashboard.make')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Group Activity Tabs */}
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats" className="flex items-center">
                <AreaChart className="h-4 w-4 mr-1" />
                <span>Stats</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Members</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{t('dashboard.history')}</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('dashboard.upcomingPayouts')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <GroupContributionChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="members">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Group Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      { name: 'You', status: 'paid', isYou: true },
                      { name: 'Claudine', status: 'paid' },
                      { name: 'Jean', status: 'pending' },
                      { name: 'Marie', status: 'paid' },
                      { name: 'Pascal', status: 'pending' },
                      { name: 'Diane', status: 'paid' },
                    ].map((member, i) => (
                      <li key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/40">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{member.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">
                            {member.name} {member.isYou && '(You)'}
                          </span>
                        </div>
                        <Badge variant={member.status === 'paid' ? 'default' : 'outline'} className="capitalize">
                          {member.status === 'paid' ? t('status.completed') : t('status.pending')}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}