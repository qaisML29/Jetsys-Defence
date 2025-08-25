import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { getStockItems, getUniqueCategories } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { ManageStockClient } from './_components/manage-stock-client';
import { ExportButton } from './_components/export-button';


export const dynamic = 'force-dynamic';

export default async function ManageStockPage() {
  const stockItems = await getStockItems();
  const categories = await getUniqueCategories();

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
                <CardDescription>The current state of your inventory.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <ExportButton data={stockItems} />
                <Button asChild>
                    <Link href="/add-stock">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Item
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
           <ManageStockClient stockItems={stockItems} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
