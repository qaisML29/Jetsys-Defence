import { PageHeader } from '@/components/page-header';
import { AddStockForm } from './_components/add-stock-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStockItems } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AddStockPage() {
  const stockItems = await getStockItems();
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Add or Restock Items"
        subtitle="Add a new item or update the quantity of an existing one."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Select an existing item from the list to restock it, or type a new name to create a new item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddStockForm stockItems={stockItems} />
        </CardContent>
      </Card>
    </div>
  );
}
