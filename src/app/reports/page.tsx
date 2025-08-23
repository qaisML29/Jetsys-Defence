import { PageHeader } from '@/components/page-header';
import { getUsageLogs, getStockItems } from '@/lib/data';
import { ReportsClient } from './_components/reports-client';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}
