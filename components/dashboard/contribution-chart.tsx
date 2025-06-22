"use client";

import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "May 28", amount: 30000, status: "upcoming", person: "Jean" },
  { name: "Jun 04", amount: 30000, status: "upcoming", person: "Claudine" },
  { name: "Jun 11", amount: 30000, status: "upcoming", person: "You" },
  { name: "Jun 18", amount: 30000, status: "upcoming", person: "Marie" },
];

export function GroupContributionChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="px-2">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? "hsl(var(--muted))" : "#f0f0f0"} 
          />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "#888" }}
          />
          <YAxis 
            tickFormatter={(value) => `${value/1000}k`} 
            tickLine={false} 
            axisLine={false}
            fontSize={12}
            tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "#888" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-lg border-l-4 border-l-primary">
                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground">{payload[0].payload.name}</p>
                      <p className="font-medium">{payload[0].payload.person} receives</p>
                      <p className="font-bold text-sm">
                        {new Intl.NumberFormat("rw-RW", {
                          style: "currency",
                          currency: "RWF",
                          minimumFractionDigits: 0,
                        }).format(payload[0].payload.amount)}
                      </p>
                    </div>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
              let color = "hsl(var(--muted))";
              if (entry.person === "You") {
                color = "hsl(var(--primary))";
              } else if (index === 0) {
                color = "hsl(var(--secondary))";
              }
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}