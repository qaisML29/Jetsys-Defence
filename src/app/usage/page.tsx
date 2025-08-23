import { PageHeader } from '@/components/page-header';
import { UsageForm } from './_components/usage-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStockItems } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function UsagePage() {
    const stockItems = await getStockItems();

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <PageHeader
                title="Log Item Usage"
                subtitle="Deduct items from inventory as they are used."
            />
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Usage Details</CardTitle>
                    <CardDescription>Fill out the form to record item usage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsageForm stockItems={stockItems} />
                </CardContent>
            </Card>
        </div>
    );
}
