import { PageHeader } from '@/components/page-header';
import { AddStockForm } from './_components/add-stock-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getUniqueCategories } from '@/lib/data';

export default async function AddStockPage() {
  const categories = await getUniqueCategories();
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Add a New Item"
        subtitle="Fill in the details to add a new item to the inventory."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Item Details</CardTitle>
          <CardDescription>
            All fields are required to create a new stock item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddStockForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
