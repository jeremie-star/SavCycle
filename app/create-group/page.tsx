"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { CalendarIcon, Copy } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CreateGroup() {
  const { t } = useLanguage();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [frequency, setFrequency] = useState('monthly');
  const [members, setMembers] = useState<number | ''>('');
  const [paymentOrder, setPaymentOrder] = useState('random');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const payload = {
      name,
      contribution_amount: amount,
      contribution_frequency: frequency,
      number_of_members: members,
      payout_order: paymentOrder,
      cycle_start_date: date?.toISOString().split('T')[0],
    };

    try {
      const res = await fetch('http://localhost:3001/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to create group:', errorData);
        toast.error('Failed to create group');
        return;
      }

      const data = await res.json();
      console.log('Group created:', data);
      toast.success('Group created successfully!', {
      description: (
        <div className="flex items-center justify-between">
          <span className="font-medium">Code: {data.group_code}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(data.group_code);
              toast.success('Code copied to clipboard!');
            }}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      ),
      duration: 16000,
    });
     const groupId = data.group?.id || data.group?.group_code;

  if (groupId) {
    // Redirect to dashboard
    router.push(`/dashboard/${groupId}`);
  }
    } catch (err) {
      console.error('Request failed', err);
      alert('An error occurred');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <Header title={t('group.create.title')} showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('group.create.title')}</CardTitle>
            <CardDescription>
              Set up your Ikimina group and invite members
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('group.create.name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Family Savings Group"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t('group.create.amount')}</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="5,000"
                  min={1000}
                  step={500}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">{t('group.create.frequency')}</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="members">{t('group.create.members')}</Label>
                <Input
                  id="members"
                  type="number"
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  placeholder="5"
                  min={3}
                  max={20}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">{t('group.create.payment')}</Label>
                <Select value={paymentOrder} onValueChange={setPaymentOrder}>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random Draw</SelectItem>
                    <SelectItem value="fixed">Fixed Order</SelectItem>
                    <SelectItem value="need">By Need</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('group.create.start')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {t('group.create.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}
