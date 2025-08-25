import { Suspense } from 'react';
import { getStockItems } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your inventory"
      />
      <Suspense fallback={<StockTableSkeleton />}>
        <StockTable />
      </Suspense>
    </div>
  );
}

async function StockTable() {
  const stockItems = await getStockItems();
  const lowStockItems = stockItems.filter(item => item.quantity < item.minStockLimit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Items</CardTitle>
        <CardDescription>
          Showing items where quantity is below the minimum stock limit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Min. Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id} className="bg-destructive/10">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.minStockLimit}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Low Stock</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No items are currently low on stock.</p>
        )}
      </CardContent>
    </Card>
  );
}

function StockTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <div className='w-1/4'><Skeleton className="h-5 w-3/4" /></div>
                <div className='w-1/4'><Skeleton className="h-5 w-2/4" /></div>
                <div className='w-1/4 text-right'><Skeleton className="h-5 w-1/4 ml-auto" /></div>
                <div className='w-1/4 text-right'><Skeleton className="h-5 w-1/4 ml-auto" /></div>
                <div className='w-1/4'><Skeleton className="h-6 w-20 ml-4" /></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
