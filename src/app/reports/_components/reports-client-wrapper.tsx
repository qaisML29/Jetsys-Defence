'use client';

import dynamic from 'next/dynamic';
import type { UsageLog, StockItem } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReportsClient = dynamic(() => import('./reports-client').then(mod => mod.ReportsClient), { 
    ssr: false,
    loading: () => <ReportsSkeleton />
});

interface ReportsClientWrapperProps {
  usageLogs: UsageLog[];
  stockItems: StockItem[];
}

export function ReportsClientWrapper({ usageLogs, stockItems }: ReportsClientWrapperProps) {
    return <ReportsClient usageLogs={usageLogs} stockItems={stockItems} />;
}

function ReportsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                           <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
