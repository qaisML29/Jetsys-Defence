'use client';

import { useState, useMemo } from 'react';
import type { UsageLog, StockItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subDays, format } from 'date-fns';


export function ReportsClient({ usageLogs, stockItems }: { usageLogs: UsageLog[]; stockItems: StockItem[] }) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');

  const filteredLogs = useMemo(() => {
    const now = new Date();
    if (dateRange === 'all') return usageLogs;
    const days = dateRange === '7d' ? 7 : 30;
    const startDate = subDays(now, days);
    return usageLogs.filter(log => new Date(log.usageDate) >= startDate);
  }, [usageLogs, dateRange]);

  const usageByItem = useMemo(() => {
    return filteredLogs.reduce((acc, log) => {
      acc[log.itemName] = (acc[log.itemName] || 0) + log.quantityUsed;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredLogs]);

  const chartData = useMemo(() => {
    return Object.entries(usageByItem)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [usageByItem]);

  const chartConfig = {
    quantity: {
      label: 'Quantity Used',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <div className="flex items-center gap-2">
                <Button variant={dateRange === '7d' ? 'default' : 'outline'} onClick={() => setDateRange('7d')}>Last 7 Days</Button>
                <Button variant={dateRange === '30d' ? 'default' : 'outline'} onClick={() => setDateRange('30d')}>Last 30 Days</Button>
                <Button variant={dateRange === 'all' ? 'default' : 'outline'} onClick={() => setDateRange('all')}>All Time</Button>
            </div>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Item Usage ({dateRange === '7d' ? 'Last 7 Days' : dateRange === '30d' ? 'Last 30 Days' : 'All Time'})</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="quantity" fill="var(--color-quantity)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Usage Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Item Used</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(new Date(log.usageDate), 'PPP')}</TableCell>
                  <TableCell>{log.employeeName}</TableCell>
                  <TableCell className="font-medium">{log.itemName}</TableCell>
                  <TableCell className="text-right">{log.quantityUsed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
