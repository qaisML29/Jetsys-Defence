'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';
import { createOrUpdateStockItem } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import type { StockItem } from '@/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';


const stockSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  minStockLimit: z.coerce.number().min(1, 'Minimum stock must be at least 1'),
});


const initialState = {
  type: null,
  message: '',
};

export function AddStockForm({ stockItems }: { stockItems: StockItem[] }) {
  const [state, formAction] = useActionState(createOrUpdateStockItem, initialState);
  const { toast } = useToast();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);
  
  const handleSelect = (item: StockItem) => {
    setIsUpdateMode(true);
    setSelectedItem(item);
    setValue(item.name.toLowerCase());
  };
  
  const handleInputChange = (currentValue: string) => {
    setValue(currentValue);
    const existingItem = stockItems.find(item => item.name.toLowerCase() === currentValue.toLowerCase());
    if (existingItem) {
        handleSelect(existingItem);
    } else {
        setIsUpdateMode(false);
        setSelectedItem(null);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden input for ID if in update mode */}
      {isUpdateMode && selectedItem && <input type="hidden" name="id" value={selectedItem.id} />}

      <div className="space-y-2">
         <Label htmlFor="name">Item Name</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                name="name-trigger"
              >
                <span className="capitalize">{value ? stockItems.find(item => item.name.toLowerCase() === value)?.name ?? value : "Select or type item..."}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput 
                  placeholder="Search item or add new..."
                  onValueChange={handleInputChange}
                  />
                <CommandList>
                  <CommandEmpty>No item found. Type to add.</CommandEmpty>
                  <CommandGroup>
                    {stockItems.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={(currentValue) => {
                          handleInputChange(currentValue);
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.name.toLowerCase() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <input type="hidden" name="name" value={value} />
          {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>

      {isUpdateMode && selectedItem ? (
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <p className="text-sm font-medium">Updating: <span className="font-bold">{selectedItem.name}</span></p>
            <div className="grid grid-cols-2 gap-4">
                <p className="text-sm">Current Stock: <span className="font-mono">{selectedItem.quantity}</span></p>
                <p className="text-sm">Location: <span className="font-mono">{selectedItem.location}</span></p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Add</Label>
                <Input id="quantity" name="quantity" type="number" placeholder="e.g., 500" required />
                 {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity[0]}</p>}
            </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Fasteners" required />
            {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
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
        </>
      )}
      
      <input type="hidden" name="isUpdateMode" value={String(isUpdateMode)} />
       {isUpdateMode && selectedItem && <input type="hidden" name="minStockLimit" value={selectedItem.minStockLimit} />}
       {isUpdateMode && selectedItem && <input type="hidden" name="category" value={selectedItem.category} />}
       {isUpdateMode && selectedItem && <input type="hidden" name="location" value={selectedItem.location} />}

      <SubmitButton isUpdateMode={isUpdateMode} />
    </form>
  );
}

function SubmitButton({ isUpdateMode }: { isUpdateMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isUpdateMode ? 'Update Item' : 'Add New Item'}
    </Button>
  );
}
