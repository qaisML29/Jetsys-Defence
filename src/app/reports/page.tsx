import { PageHeader } from '@/components/page-header';
import { getUsageLogs, getStockItems } from '@/lib/data';
import { ReportsClientWrapper } from './_components/reports-client-wrapper';


export default async function ReportsPage() {
  const usageLogs = await getUsageLogs();
  const stockItems = await getStockItems();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze inventory usage and trends."
      />
      <ReportsClientWrapper usageLogs={usageLogs} stockItems={stockItems} />
    </div>
  );
}
