'use client';

import { useState } from 'react';
import type { StockItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EditStockForm } from './edit-stock-form';
import { DeleteStockAlert } from './delete-stock-alert';
import { Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface ManageStockClientProps {
  stockItems: StockItem[];
  categories: string[];
}

export function ManageStockClient({ stockItems, categories }: ManageStockClientProps) {
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const router = useRouter();
  
  const onUpdateSuccess = () => {
    setEditingItem(null);
    router.refresh();
  };
  
  const onDeleteSuccess = () => {
    router.refresh();
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Location</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Quantity (KG)</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Min. Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden md:table-cell">{item.category}</TableCell>
              <TableCell className="hidden sm:table-cell">{item.location}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="hidden lg:table-cell text-right">{item.quantityKg ?? 'N/A'}</TableCell>
              <TableCell className="hidden lg:table-cell text-right">{item.minStockLimit}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
                  <Dialog open={editingItem?.id === item.id} onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {item.name}</DialogTitle>
                      </DialogHeader>
                      <EditStockForm item={item} categories={categories} onUpdateSuccess={onUpdateSuccess} />
                    </DialogContent>
                  </Dialog>
                  
                  <DeleteStockAlert item={item} onDeleteSuccess={onDeleteSuccess}>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteStockAlert>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
