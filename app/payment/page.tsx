"use client";

import { useLanguage } from '@/contexts/language-context';
import { Header } from '@/components/header';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function Payment() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId'); // Extract groupId from URL parameters
  
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState<number>(); 

  useEffect(() => {
    const storedMethod = localStorage.getItem("selected_payment_method");
    if (storedMethod) {
      setPaymentMethod(storedMethod);
    }
    
    // Check if groupId exists
    if (!groupId) {
      toast.error("No group found. Redirecting to dashboard.");
      router.push('/dashboard');
    }
  }, [groupId, router]);

  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupId) {
      toast.error("Group ID is missing");
      return;
    }
    
    // Validate based on payment method
    if (paymentMethod === 'mobile-money' && !phoneNumber) {
      toast("Please enter your phone number");
      return;
    }
    
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
      toast("Please fill all card details");
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const payload = parseJwt(token);
      const user_id = payload?.id || payload?.Id; 

      if (!user_id || !groupId) {
        toast.error("Missing user or group ID");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/contributions/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          amount: amount,
          payment_method: paymentMethod,
          status: "completed",
          contribution_date: new Date().toISOString(),
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process payment");
      }

      toast.success("Your contribution was successful!");
      setShowSuccess(true);

    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Payment failed: " + err.message);
    }
  };

  const handleComplete = () => {
    setShowSuccess(false);
    // Navigate back to the specific group dashboard
    router.push(`/dashboard/${groupId}`);
  };

  const handleBack = () => {
    // Navigate back to the specific group dashboard
    if (groupId) {
      router.push(`/dashboard/${groupId}`);
    } else {
      router.back();
    }
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading or redirect if no groupId
  if (!groupId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={t('payment.title')} showBackButton onBack={handleBack} />
      <main className="container max-w-md mx-auto px-4 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('payment.title')}</CardTitle>
            <CardDescription>
              Make your contribution Now
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('payment.amount')}</Label>
                <div className="relative">
                  <Input 
                     id="amount"
                     type="number"
                     value={amount}
                     onChange={(e) => setAmount(Number(e.target.value))}
                     className="pl-16"
                      />
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r bg-muted/50">
                    <span className="text-sm font-medium">RWF</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fixed contribution amount
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>{t('payment.method')}</Label>
                <RadioGroup 
                  defaultValue="mobile-money" 
                  value={paymentMethod}
                  onValueChange={(value) => {
                     setPaymentMethod(value);
                        localStorage.setItem("selected_payment_method", value);
             }}
                >
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
                  
                  {/* Mobile Money Phone Number Input */}
                  {paymentMethod === 'mobile-money' && (
                    <div className="space-y-2 pl-10">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 xxx xxx xxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-secondary" />
                      <div className="space-y-1">
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">Pay with your card</p>
                      </div>
                    </Label>
                  </div>
                  
                  {/* Card Details Input */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 pl-10">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          name="number"
                          type="text"
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={cardDetails.number}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          name="name"
                          type="text"
                          placeholder="name on card"
                          value={cardDetails.name}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            name="expiry"
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            name="cvv"
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
              You are about to make a contribution of {amount} RWF to the group
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Amount:</span>
              <span className="font-medium">{amount} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Payment Method:</span>
              <span className="font-medium">
                {paymentMethod === 'mobile-money' ? 'MTN Mobile Money' : 'Credit/Debit Card'}
              </span>
            </div>
            {paymentMethod === 'mobile-money' && (
              <div className="flex justify-between">
                <span className="text-sm">Phone Number:</span>
                <span className="font-medium">{phoneNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm">Transaction Fee:</span>
              <span className="font-medium">0 RWF</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-sm font-medium">Total:</span>
              <span className="font-bold">{amount} RWF</span>
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
              Your contribution of {amount} RWF has been successfully processed
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