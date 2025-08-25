'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { logUsageAction } from '@/lib/actions';
import type { StockItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface UsageFormProps {
  stockItems: StockItem[];
}

const usageSchema = z.object({
  employeeName: z.string().min(3, 'Employee name is required'),
  itemId: z.string().min(1, 'You must select an item'),
  quantityUsed: z.coerce.number().min(0, 'Quantity must be non-negative').optional(),
  quantityKgUsed: z.coerce.number().min(0, 'Quantity (KG) must be non-negative').optional(),
}).refine(data => data.quantityUsed || data.quantityKgUsed, {
    message: 'At least one quantity field must be filled',
    path: ['quantityUsed'],
});


type UsageFormData = z.infer<typeof usageSchema>;

const initialState = {
  type: null,
  message: '',
};

export function UsageForm({ stockItems }: UsageFormProps) {
  const [state, formAction] = useActionState(logUsageAction, initialState);
  const { toast } = useToast();

  const form = useForm<UsageFormData>({
    resolver: zodResolver(usageSchema),
    defaultValues: {
      employeeName: '',
      itemId: '',
    },
  });

  useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      form.reset();
    } else if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, form]);

  const onSubmit = (data: UsageFormData) => {
    const formData = new FormData();
    formData.append('employeeName', data.employeeName);
    formData.append('itemId', data.itemId);
    if(data.quantityUsed) formData.append('quantityUsed', String(data.quantityUsed));
    if(data.quantityKgUsed) formData.append('quantityKgUsed', String(data.quantityKgUsed));
    formAction(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Item Used</FormLabel>
               <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? stockItems.find(
                            (item) => item.id === field.value
                          )?.name
                        : 'Select an item to deduct'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {stockItems.map((item) => (
                          <CommandItem
                            value={item.name}
                            key={item.id}
                            onSelect={() => {
                              form.setValue('itemId', item.id)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                item.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {item.name} (In stock: {item.quantity}, {item.quantityKg ?? 0} KG)
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="quantityUsed"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantity Used</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="quantityKgUsed"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantity (KG) Used</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 2.5" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
            <SubmitButton />
        </div>
      </form>
    </Form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Log Usage
    </Button>
  );
}
