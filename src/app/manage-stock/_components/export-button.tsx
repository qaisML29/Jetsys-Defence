'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { StockItem } from '@/types';

interface ExportButtonProps {
    data: StockItem[];
}

export function ExportButton({ data }: ExportButtonProps) {
    const handleExport = () => {
        const headers = [
            'ID',
            'Name',
            'Category',
            'Quantity',
            'Quantity KG',
            'Min Stock Limit',
            'Location',
            'Last Updated'
        ];
        
        const csvRows = [headers.join(',')];

        data.forEach(item => {
            const row = [
                item.id,
                `"${item.name.replace(/"/g, '""')}"`,
                `"${item.category.replace(/"/g, '""')}"`,
                item.quantity,
                item.quantityKg ?? 'N/A',
                item.minStockLimit,
                `"${item.location.replace(/"/g, '""')}"`,
                item.lastUpdated
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `jetsys_inventory_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
        </Button>
    );
}
