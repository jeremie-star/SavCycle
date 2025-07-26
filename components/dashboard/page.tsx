'use client';

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { GroupContributionChart } from '@/components/dashboard/contribution-chart';
import { PaymentHistory } from '@/components/dashboard/payment-history';
import React, { useState, useEffect } from 'react';

interface Member {
  id: string;
  full_name: string;
  status: 'paid' | 'pending';
  isYou?: boolean;
}

interface Group {
  id: string;
  name: string;
  contribution_amount: number;
  contribution_frequency: string;
  number_of_members: number;
  payout_order: 'random' | 'fixed' | 'need';
  cycle_start_date: string;
  group_code: string;
}

interface DashboardProps {
  group: Group;
  members: Member[];
}

export default function Dashboard({ group, members }: DashboardProps) {
  const { t } = useLanguage();

  // Use passed members from props instead of demo data
  const groupMembers = members.length
    ? members
    : [];

  // Payout order logic state
  const [payoutOrderType, setPayoutOrderType] = useState<'random' | 'fixed' | 'need'>(group.payout_order || 'random');
  const [fixedQueue, setFixedQueue] = useState(groupMembers.map(m => m.full_name));
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

  // Update random queue on payoutOrderType change
  useEffect(() => {
    if (payoutOrderType === 'random') {
      setRandomQueue(shuffle(groupMembers.map(m => m.full_name)));
    }
  }, [payoutOrderType, groupMembers]);

  return (
    <div className="min-h-screen">
      <Header title={t('dashboard.title')} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <div className="space-y-6">
          {/* Payout Order Type Switcher */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Order</CardTitle>
              <CardDescription>Choose how the payout order is determined for this group.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={payoutOrderType === 'random' ? 'default' : 'outline'}
                  onClick={() => setPayoutOrderType('random')}
                >
                  Random Draw
                </Button>
                <Button
                  variant={payoutOrderType === 'fixed' ? 'default' : 'outline'}
                  onClick={() => setPayoutOrderType('fixed')}
                >
                  Fixed
                </Button>
                <Button
                  variant={payoutOrderType === 'need' ? 'default' : 'outline'}
                  onClick={() => setPayoutOrderType('need')}
                >
                  By Need
                </Button>
              </div>
              {/* Render payout queue based on selected type */}
              {payoutOrderType === 'random' && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Randomly generated payout queue:</p>
                  <ol className="list-decimal ml-4">
                    {randomQueue.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ol>
                  {randomQueue.length > 0 && (
                    <div className="mt-4 text-sm">
                      <p className="font-medium text-muted-foreground">Next to receive payout:</p>
                      <p className="text-lg font-bold text-primary">{randomQueue[0]}</p>
                    </div>
                  )}
                  <Button size="sm" className="mt-2" onClick={() => setRandomQueue(shuffle(groupMembers.map(m => m.full_name)))}>
                    Reshuffle
                  </Button>
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
                  {fixedQueue.length > 0 && (
                    <div className="mt-4 text-sm">
                      <p className="font-medium text-muted-foreground">Next to receive payout:</p>
                      <p className="text-lg font-bold text-primary">{fixedQueue[0]}</p>
                    </div>
                  )}
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
                    <option value="" disabled>
                      Select member
                    </option>
                    {groupMembers.map((m, idx) => (
                      <option key={idx} value={m.full_name}>
                        {m.full_name}
                      </option>
                    ))}
                  </select>
                  {needPerson && (
                    <div className="mt-2">
                      Selected: <b>{needPerson}</b>
                    </div>
                  )}
                  {needPerson && (
                    <div className="mt-4 text-sm">
                      <p className="font-medium text-muted-foreground">Next to receive payout:</p>
                      <p className="text-lg font-bold text-primary">{needPerson}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{group.name}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {group.contribution_frequency}
                </Badge>
              </div>
              <CardDescription>
                {groupMembers.length} members • {group.contribution_amount.toLocaleString()} RWF per {group.contribution_frequency}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{t('dashboard.progress')}</span>
                  {/* You should calculate real progress here */}
                  <span className="font-medium">4/24 weeks</span>
                </div>
                <Progress value={16.67} className="h-2" />
                <div className="bg-muted/40 rounded-lg p-3 flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{t('dashboard.nextPayment')}</p>
                      {/* Next payment date - should come from backend */}
                      <p className="text-xs text-muted-foreground">Sunday, May 21</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Remind
                  </Button>
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
                  {/* Replace with real contribution amount */}
                  <p className="text-2xl font-bold">{group.contribution_amount.toLocaleString()} RWF</p>
                  <p className="text-xs text-muted-foreground">Pay for this turn</p>
                </div>
                <Button asChild>
                  <Link href={`/payment?groupId=${group.id}`}>{t('dashboard.make')}</Link>
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
                    {groupMembers.map((member, i) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/40"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{member.full_name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">
                            {member.full_name} {member.isYou && '(You)'}
                          </span>
                        </div>
                        <Badge
                          variant={member.status === 'paid' ? 'default' : 'outline'}
                          className="capitalize"
                        >
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
