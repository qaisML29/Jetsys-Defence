'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { editStockItem } from '@/lib/actions';
import type { StockItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditStockFormProps {
  item: StockItem;
  onUpdateSuccess: (updatedItem: StockItem) => void;
}

const stockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  minStockLimit: z.coerce.number().min(0, 'Minimum stock cannot be negative'),
});

const initialState = {
  type: null,
  message: '',
};

export function EditStockForm({ item, onUpdateSuccess }: EditStockFormProps) {
  const [state, formAction] = useFormState(editStockItem.bind(null, item.id), initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      const formData = new FormData();
      // This is a bit of a hack to get the form data back to the parent without re-fetching
      formData.append('name', (document.getElementById('name') as HTMLInputElement).value);
      formData.append('category', (document.getElementById('category') as HTMLInputElement).value);
      formData.append('quantity', (document.getElementById('quantity') as HTMLInputElement).value);
      formData.append('minStockLimit', (document.getElementById('minStockLimit') as HTMLInputElement).value);

      const updatedItem = {
        ...item,
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        quantity: Number(formData.get('quantity')),
        minStockLimit: Number(formData.get('minStockLimit')),
      };
      onUpdateSuccess(updatedItem);

    } else if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, onUpdateSuccess, item]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" name="name" defaultValue={item.name} required />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={item.category} required />
        {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" defaultValue={item.quantity} required />
           {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStockLimit">Minimum Stock Limit</Label>
          <Input id="minStockLimit" name="minStockLimit" type="number" defaultValue={item.minStockLimit} required />
          {state.errors?.minStockLimit && <p className="text-sm text-destructive">{state.errors.minStockLimit[0]}</p>}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Save Changes
    </Button>
  );
}
