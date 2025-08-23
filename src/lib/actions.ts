'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import {
  addStockItem,
  updateStockItem,
  deleteStockItem,
  addUsageLog,
  getStockItem,
  updateSettings,
  getSettings,
} from './data';
import type { AppSettings, StockItem } from '@/types';
import twilio from 'twilio';
import { redirect } from 'next/navigation';

const stockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  quantityKg: z.coerce.number().min(0, 'Quantity KG cannot be negative').optional(),
  minStockLimit: z.coerce
    .number()
    .int()
    .min(0, 'Minimum stock cannot be negative'),
});

// Helper function to send notifications
async function sendLowStockAlert(item: StockItem) {
  const settings = await getSettings();
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.log("Twilio credentials are not set in environment variables. Skipping WhatsApp alert.");
    return;
  }

  if (settings.phoneNumbers && settings.phoneNumbers.length > 0) {
    const message = `JETSYS™ Alert: Stock for "${item.name}" is low. Current quantity: ${item.quantity}. Minimum limit: ${item.minStockLimit}.`;
    
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log(`--- Low Stock Alert Triggered for ${item.name} ---`);
    for (const phoneNumber of settings.phoneNumbers) {
      try {
        await client.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
          to: `whatsapp:${phoneNumber}`
        });
        console.log(`Successfully sent WhatsApp message to ${phoneNumber}`);
      } catch (error) {
        console.error(`Failed to send WhatsApp message to ${phoneNumber}:`, error);
      }
    }
    console.log(`--- End of Alert ---`);
  }
}

export async function createStockItem(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    category: formData.get('category'),
    location: formData.get('location'),
    quantity: formData.get('quantity'),
    quantityKg: formData.get('quantityKg') || undefined,
    minStockLimit: formData.get('minStockLimit'),
  };
  const validatedFields = stockSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data. Please check the form.',
    };
  }

  try {
    const newItem = await addStockItem(validatedFields.data);

    // Check if the new item is already low on stock
    if (newItem.quantity < newItem.minStockLimit) {
      await sendLowStockAlert(newItem);
    }

    revalidatePath('/');
    revalidatePath('/manage-stock');
    
  } catch (error) {
    return { type: 'error', message: 'Failed to create stock item.' };
  }
  
  redirect('/manage-stock');
}

export async function editStockItem(
  id: string,
  prevState: any,
  formData: FormData
) {
  const rawData = {
    name: formData.get('name'),
    category: formData.get('category'),
    location: formData.get('location'),
    quantity: formData.get('quantity'),
    quantityKg: formData.get('quantityKg') || undefined,
    minStockLimit: formData.get('minStockLimit'),
  };

  const validatedFields = stockSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data. Please check the form.',
    };
  }

  try {
    const originalItem = await getStockItem(id);
    const wasLow = originalItem ? originalItem.quantity < originalItem.minStockLimit : false;

    const updatedItem = await updateStockItem(id, validatedFields.data);

    if (updatedItem) {
      const isLow = updatedItem.quantity < updatedItem.minStockLimit;
      // Trigger alert if it just became low
      if (isLow && !wasLow) {
        await sendLowStockAlert(updatedItem);
      }
    }

    revalidatePath('/');
    revalidatePath('/manage-stock');
    return {
      type: 'success',
      message: `Updated ${validatedFields.data.name}.`,
    };
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
  employeeName: z.string().min(3, 'Employee name is required'),
  itemId: z.string().min(1, 'You must select an item'),
  quantityUsed: z.coerce.number().min(1, 'Quantity must be at least 1'),
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
    const { updatedItem, wasLow } = await addUsageLog({
      ...validatedFields.data,
      itemName: '', // Will be set in addUsageLog
      usageDate: new Date().toISOString(),
    });

    // Check if the item just became low on stock
    if (
      updatedItem &&
      updatedItem.quantity < updatedItem.minStockLimit &&
      !wasLow
    ) {
      await sendLowStockAlert(updatedItem);
    }

    revalidatePath('/');
    revalidatePath('/manage-stock');
    revalidatePath('/usage');
    revalidatePath('/reports');

    return { type: 'success', message: 'Usage logged successfully.' };
  } catch (e) {
    const error = e as Error;
    return {
      type: 'error',
      message: error.message || 'Failed to log usage.',
    };
  }
}

const settingsSchema = z.object({
  phoneNumbers: z.array(z.string()),
});

export async function saveSettings(prevState: any, formData: FormData) {
  const phoneNumbersRaw = formData.get('phoneNumbers');
  let phoneNumbers: string[] = [];
  try {
    if (typeof phoneNumbersRaw === 'string') {
      phoneNumbers = JSON.parse(phoneNumbersRaw);
    }
  } catch (error) {
    return { type: 'error', message: 'Invalid phone numbers format.' };
  }
  
  const settingsData = {
    phoneNumbers: phoneNumbers,
  };

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
    return {
      type: 'success',
      message: 'Settings saved successfully.',
      phoneNumbers: newSettings.phoneNumbers,
    };
  } catch (error) {
    return { type: 'error', message: 'Failed to save settings.' };
  }
}
