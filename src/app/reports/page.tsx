import { PageHeader } from '@/components/page-header';
import { getUsageLogs, getStockItems } from '@/lib/data';
import { ReportsClient } from './_components/reports-client';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze inventory usage and trends."
      />
      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsData />
      </Suspense>
    </div>
  );
}

async function ReportsData() {
    const usageLogs = await getUsageLogs();
    const stockItems = await getStockItems();
    return <ReportsClient usageLogs={usageLogs} stockItems={stockItems} />
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
