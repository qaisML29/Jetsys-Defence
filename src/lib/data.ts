import type { StockItem, UsageLog, AppSettings } from '@/types';
import fs from 'fs';
import path from 'path';

// --- File-based database ---

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'db.json');

interface Db {
  stockItems: StockItem[];
  usageLogs: UsageLog[];
  settings: AppSettings;
}

const defaultData: Db = {
    stockItems: [
        { id: '1', name: 'Screws', category: 'Fasteners', quantity: 4800, minStockLimit: 1000, location: 'Aisle 1, Bin A', lastUpdated: '2025-08-23T12:53:46.821Z' },
        { id: '2', name: 'Nuts', category: 'Fasteners', quantity: 8000, minStockLimit: 2000, location: 'Aisle 1, Bin B', lastUpdated: '2025-08-23T12:53:46.821Z' },
        { id: '3', name: 'Bolts', category: 'Fasteners', quantity: 300, minStockLimit: 500, location: 'Aisle 1, Bin C', lastUpdated: '2025-08-23T12:53:46.821Z' },
        { id: '4', name: 'Rivets', category: 'Fasteners', quantity: 10000, minStockLimit: 2500, location: 'Aisle 2, Bin A', lastUpdated: '2025-08-23T12:53:46.821Z' },
        { id: '5', name: 'Aluminum Plate', category: 'Materials', quantity: 150, minStockLimit: 50, location: 'Yard 1', lastUpdated: '2025-08-23T12:53:46.821Z' },
    ],
    usageLogs: [
        { id: 'log1', employeeName: 'John Doe', itemId: '1', itemName: 'Screws', quantityUsed: 200, usageDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'log2', employeeName: 'Jane Smith', itemId: '2', itemName: 'Nuts', quantityUsed: 500, usageDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'log3', employeeName: 'John Doe', itemId: '5', itemName: 'Aluminum Plate', quantityUsed: 5, usageDate: new Date().toISOString() },
    ],
    settings: {
        phoneNumbers: ['9872241604'],
    }
};

function readDb(): Db {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading from db.json, falling back to default data.", error);
  }
  
  // If db.json doesn't exist, create it with default data
  writeDb(defaultData);
  return JSON.parse(JSON.stringify(defaultData)); 
}

function writeDb(data: Db) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to db.json.", error);
  }
}

// --- API simulation functions ---

// Stock Items
export const getStockItems = async (): Promise<StockItem[]> => {
  const db = readDb();
  return [...db.stockItems].sort((a, b) => a.name.localeCompare(b.name));
};

export const getStockItem = async (id: string): Promise<StockItem | undefined> => {
  const db = readDb();
  return db.stockItems.find(item => item.id === id);
}

export const addStockItem = async (item: Omit<StockItem, 'id' | 'lastUpdated'>): Promise<StockItem> => {
  const db = readDb();
  const newItem: StockItem = {
    ...item,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString(),
  };
  db.stockItems.push(newItem);
  writeDb(db);
  return newItem;
};

export const updateStockItem = async (id: string, updateData: Partial<Omit<StockItem, 'id'>>): Promise<StockItem | null> => {
  const db = readDb();
  const itemIndex = db.stockItems.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    db.stockItems[itemIndex] = { ...db.stockItems[itemIndex], ...updateData, lastUpdated: new Date().toISOString() };
    writeDb(db);
    return db.stockItems[itemIndex];
  }
  return null;
};

export const deleteStockItem = async (id: string): Promise<{ success: boolean }> => {
  const db = readDb();
  const initialLength = db.stockItems.length;
  db.stockItems = db.stockItems.filter(item => item.id !== id);
  const success = db.stockItems.length < initialLength;
  if(success) {
      writeDb(db);
  }
  return { success };
};

// Usage Logs
export const getUsageLogs = async (): Promise<UsageLog[]> => {
  const db = readDb();
  return [...db.usageLogs].sort((a, b) => new Date(b.usageDate).getTime() - new Date(a.usageDate).getTime());
};

export const addUsageLog = async (log: Omit<UsageLog, 'id' | 'itemName'> & { itemName: string }): Promise<{newLog: UsageLog, updatedItem: StockItem, wasLow: boolean}> => {
  const db = readDb();
  
  const itemIndex = db.stockItems.findIndex(item => item.id === log.itemId);
  if (itemIndex === -1) {
    throw new Error("Item not found");
  }
  
  const stockItem = db.stockItems[itemIndex];

  if (stockItem.quantity < log.quantityUsed) {
    throw new Error("Insufficient stock");
  }

  const wasLow = stockItem.quantity < stockItem.minStockLimit;

  stockItem.quantity -= log.quantityUsed;
  stockItem.lastUpdated = new Date().toISOString();
  
  const newLog: UsageLog = {
    ...log,
    id: Date.now().toString(),
    itemName: stockItem.name, 
  };
  db.usageLogs.push(newLog);
  
  writeDb(db);
  
  return { newLog, updatedItem: stockItem, wasLow };
};

// Settings
export const getSettings = async (): Promise<AppSettings> => {
  const db = readDb();
  return { ...db.settings };
};

export const updateSettings = async (newSettings: AppSettings): Promise<AppSettings> => {
  const db = readDb();
  db.settings = { ...newSettings };
  writeDb(db);
  return { ...db.settings };
};
