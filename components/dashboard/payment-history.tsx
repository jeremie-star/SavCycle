"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

const paymentHistory = [
  {
    week: "Week 1",
    date: "Apr 30, 2023",
    amount: 5000,
    status: "completed",
  },
  {
    week: "Week 2",
    date: "May 7, 2023",
    amount: 5000,
    status: "completed",
  },
  {
    week: "Week 3",
    date: "May 14, 2023",
    amount: 5000,
    status: "completed",
  },
  {
    week: "Week 4",
    date: "May 21, 2023",
    amount: 5000, 
    status: "pending",
  },
];

export function PaymentHistory() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {paymentHistory.map((payment, index) => (
        <div 
          key={index}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            payment.status === "completed" 
              ? "bg-success/5 border-success/20" 
              : "bg-muted/40 border-muted"
          )}
        >
          <div className="flex items-center">
            {payment.status === "completed" ? (
              <CheckCircle className="h-5 w-5 text-success mr-2" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <div>
              <p className="font-medium text-sm">{payment.week}</p>
              <p className="text-xs text-muted-foreground">{payment.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{payment.amount.toLocaleString()} RWF</p>
            <Badge 
              variant={payment.status === "completed" ? "outline" : "secondary"}
              className={cn(
                "text-xs capitalize",
                payment.status === "completed" ? "border-success/50 text-success" : ""
              )}
            >
              {t(`status.${payment.status}`)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}