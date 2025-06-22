"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function Payment() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    
    // Simulate processing
    toast({
      title: "Processing payment...",
      description: "Please wait while we process your contribution."
    });
    
    // Show success after 2 seconds
    setTimeout(() => {
      setShowSuccess(true);
    }, 2000);
  };

  const handleComplete = () => {
    setShowSuccess(false);
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <Header title={t('payment.title')} showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('payment.title')}</CardTitle>
            <CardDescription>
              Make your contribution to the Family Savings Group
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('payment.amount')}</Label>
                <div className="relative">
                  <Input 
                    id="amount" 
                    value="5,000" 
                    disabled
                    className="pl-16"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r bg-muted/50">
                    <span className="text-sm font-medium">RWF</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fixed weekly contribution amount
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>{t('payment.method')}</Label>
                <RadioGroup defaultValue="mobile-money" onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="mobile-money" id="mobile-money" />
                    <Label htmlFor="mobile-money" className="flex items-center cursor-pointer">
                      <Smartphone className="h-5 w-5 mr-2 text-secondary" />
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Pay directly from your MTN account</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-muted-foreground">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">Coming soon</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted/30 border rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-xs">
                  By making this payment, you confirm your contribution to the 
                  group. Once processed, this payment cannot be automatically reversed.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={paymentMethod !== 'mobile-money'}
              >
                {t('payment.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <MobileNav />
      
      {/* Payment Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              You are about to make a contribution of 5,000 RWF to the Family Savings Group
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Amount:</span>
              <span className="font-medium">5,000 RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Payment Method:</span>
              <span className="font-medium">MTN Mobile Money</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Transaction Fee:</span>
              <span className="font-medium">0 RWF</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-sm font-medium">Total:</span>
              <span className="font-bold">5,000 RWF</span>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-center">
              <CheckCircleIcon className="h-12 w-12 text-success mb-2" />
              <span>{t('payment.success')}</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              Your contribution of 5,000 RWF has been successfully processed
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Transaction ID:</span>
                <span className="font-medium">MM2023052115689</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Date & Time:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleComplete}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}