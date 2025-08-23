'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { createStockItem } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const stockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  minStockLimit: z.coerce.number().min(1, 'Minimum stock must be at least 1'),
});

type StockFormData = z.infer<typeof stockSchema>;

const initialState = {
  type: null,
  message: '',
};

export function AddStockForm() {
  const [state, formAction] = useActionState(createStockItem, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input id="name" name="name" placeholder="e.g., Aluminum Screws" required />
          {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="e.g., Fasteners" required />
          {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="e.g., Aisle 5, Shelf B" required />
        {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" placeholder="e.g., 5000" required />
          {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStockLimit">Minimum Stock Limit</Label>
          <Input id="minStockLimit" name="minStockLimit" type="number" placeholder="e.g., 1000" required />
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
      Add Item
    </Button>
  );
}
