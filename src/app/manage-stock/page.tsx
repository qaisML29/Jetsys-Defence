import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { getStockItems } from '@/lib/data';
import { ManageStockClient } from './_components/manage-stock-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ManageStockPage() {
  const stockItems = await getStockItems();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Manage Stock"
        subtitle="Update quantities, details, or remove items from inventory."
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle>Inventory List</CardTitle>
                <CardDescription>Click on an item to edit or delete.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/add-stock">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Item
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <ManageStockClient stockItems={stockItems} />
        </CardContent>
      </Card>
    </div>
  );
}
