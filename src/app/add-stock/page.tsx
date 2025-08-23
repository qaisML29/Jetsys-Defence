import { PageHeader } from '@/components/page-header';
import { AddStockForm } from './_components/add-stock-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddStockPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Add New Stock"
        subtitle="Enter the details of the new inventory item."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AddStockForm />
        </CardContent>
      </Card>
    </div>
  );
}
