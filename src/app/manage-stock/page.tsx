import { PageHeader } from '@/components/page-header';
import { getStockItems } from '@/lib/data';
import { ManageStockClient } from './_components/manage-stock-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ManageStockPage() {
  const stockItems = await getStockItems();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Manage Stock"
        subtitle="Update quantities, details, or remove items from inventory."
      />
      <Card>
        <CardHeader>
            <CardTitle>Inventory List</CardTitle>
            <CardDescription>Click on an item to edit or delete.</CardDescription>
        </CardHeader>
        <CardContent>
            <ManageStockClient stockItems={stockItems} />
        </CardContent>
      </Card>
    </div>
  );
}
