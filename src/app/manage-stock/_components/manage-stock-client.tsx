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

interface ManageStockClientProps {
  stockItems: StockItem[];
}

export function ManageStockClient({ stockItems: initialStockItems }: ManageStockClientProps) {
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const onUpdateSuccess = (updatedItem: StockItem) => {
    setStockItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsEditDialogOpen(false);
  };
  
  const onDeleteSuccess = (deletedItemId: string) => {
    setStockItems(prevItems => prevItems.filter(item => item.id !== deletedItemId));
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Min. Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{item.minStockLimit}</TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit {item.name}</DialogTitle>
                    </DialogHeader>
                    <EditStockForm item={item} onUpdateSuccess={onUpdateSuccess} />
                  </DialogContent>
                </Dialog>
                
                <DeleteStockAlert item={item} onDeleteSuccess={onDeleteSuccess}>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </DeleteStockAlert>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
