'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addStockItem, updateStockItem, deleteStockItem, addUsageLog, getStockItem, updateSettings } from './data';
import type { AppSettings } from '@/types';

const stockSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number'),
  minStockLimit: z.coerce.number().int().positive('Minimum stock must be a positive number'),
});

export async function createStockItem(prevState: any, formData: FormData) {
  const validatedFields = stockSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    quantity: formData.get('quantity'),
    minStockLimit: formData.get('minStockLimit'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data. Please check the form.',
    };
  }
  
  try {
    await addStockItem(validatedFields.data);
    revalidatePath('/');
    revalidatePath('/manage-stock');
    return { type: 'success', message: `Added ${validatedFields.data.name} to stock.` };
  } catch (error) {
    return { type: 'error', message: 'Failed to create stock item.' };
  }
}

export async function editStockItem(id: string, prevState: any, formData: FormData) {
    const validatedFields = stockSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        quantity: formData.get('quantity'),
        minStockLimit: formData.get('minStockLimit'),
    });

    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid data. Please check the form.',
        };
    }

    try {
        await updateStockItem(id, validatedFields.data);
        revalidatePath('/');
        revalidatePath('/manage-stock');
        return { type: 'success', message: `Updated ${validatedFields.data.name}.` };
    } catch (error) {
        return { type: 'error', message: 'Failed to update stock item.' };
    }
}

export async function removeStockItem(id: string) {
    try {
        await deleteStockItem(id);
        revalidatePath('/');
        revalidatePath('/manage-stock');
        return { type: 'success', message: 'Stock item deleted.' };
    } catch (error) {
        return { type: 'error', message: 'Failed to delete stock item.' };
    }
}


const usageSchema = z.object({
    employeeName: z.string().min(3, 'Employee name must be at least 3 characters'),
    itemId: z.string().min(1, 'You must select an item'),
    quantityUsed: z.coerce.number().int().positive('Quantity must be a positive number'),
});


export async function logUsageAction(prevState: any, formData: FormData) {
    const validatedFields = usageSchema.safeParse({
        employeeName: formData.get('employeeName'),
        itemId: formData.get('itemId'),
        quantityUsed: formData.get('quantityUsed'),
    });

    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid data. Please check the form.',
        };
    }
    
    try {
        const item = await getStockItem(validatedFields.data.itemId);
        if(!item) {
             return { type: 'error', message: 'Item not found.' };
        }

        await addUsageLog({
            ...validatedFields.data,
            itemName: item.name,
            usageDate: new Date().toISOString()
        });
        
        revalidatePath('/');
        revalidatePath('/manage-stock');
        revalidatePath('/usage');
        revalidatePath('/reports');

        return { type: 'success', message: 'Usage logged successfully.' };
    } catch (e) {
        const error = e as Error;
        return { type: 'error', message: error.message || 'Failed to log usage.' };
    }
}

const settingsSchema = z.object({
  phoneNumbers: z.array(z.string()),
});

export async function saveSettings(prevState: any, formData: FormData) {
    const phoneNumbersRaw = formData.get('phoneNumbers');
    let phoneNumbers: string[] = [];
    try {
        if(typeof phoneNumbersRaw === 'string') {
            phoneNumbers = JSON.parse(phoneNumbersRaw);
        }
    } catch (error) {
        return { type: 'error', message: 'Invalid phone numbers format.' };
    }

    const settingsData = {
        phoneNumbers: phoneNumbers.filter(ph => ph && ph.trim().length > 0),
    }

    const validatedFields = settingsSchema.safeParse(settingsData);
    
    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid data provided for settings.',
        };
    }
    
    try {
        const newSettings = await updateSettings(validatedFields.data);
        revalidatePath('/settings');
        return { type: 'success', message: 'Settings saved successfully.', phoneNumbers: newSettings.phoneNumbers };
    } catch (error) {
        return { type: 'error', message: 'Failed to save settings.' };
    }
}
