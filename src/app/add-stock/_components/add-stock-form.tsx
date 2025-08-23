'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createStockItem } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface AddStockFormProps {
  categories: string[];
}


const initialState = {
  type: null,
  message: '',
  errors: null,
};

export function AddStockForm({ categories }: AddStockFormProps) {
  const [state, formAction] = useActionState(createStockItem, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    } else if (state.type === 'success') {
      router.push('/manage-stock');
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" name="name" placeholder="e.g., Screws" required />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Input type="hidden" name="category" value={value} />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? categories.find((category) => category.toLowerCase() === value.toLowerCase()) || value
                : "Select or create a category..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput 
                placeholder="Search category..."
                onInput={(e) => setValue(e.currentTarget.value)}
              />
              <CommandList>
                <CommandEmpty>
                  { value ? `Create "${value}"` : 'No category found.' }
                </CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.toLowerCase() === category.toLowerCase() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="e.g., Aisle 1, Bin A" required />
        {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" placeholder="e.g., 5000" required />
          {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantityKg">Quantity (KG)</Label>
          <Input id="quantityKg" name="quantityKg" type="number" placeholder="e.g., 12.5" step="any" />
          {state.errors?.quantityKg && <p className="text-sm text-destructive">{state.errors.quantityKg[0]}</p>}
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
      Add New Item
    </Button>
  );
}
