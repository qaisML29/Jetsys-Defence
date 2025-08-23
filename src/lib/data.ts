import type { StockItem, UsageLog, AppSettings } from '@/types';

// --- In-memory database simulation ---

let stockItems: StockItem[] = [
  { id: '1', name: 'Screws', category: 'Fasteners', quantity: 5000, minStockLimit: 1000, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Nuts', category: 'Fasteners', quantity: 8000, minStockLimit: 2000, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Bolts', category: 'Fasteners', quantity: 300, minStockLimit: 500, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Rivets', category: 'Fasteners', quantity: 10000, minStockLimit: 2500, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Aluminum Plate', category: 'Materials', quantity: 150, minStockLimit: 50, lastUpdated: new Date().toISOString() },
];

let usageLogs: UsageLog[] = [
    { id: 'log1', employeeName: 'John Doe', itemId: '1', itemName: 'Screws', quantityUsed: 200, usageDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'log2', employeeName: 'Jane Smith', itemId: '2', itemName: 'Nuts', quantityUsed: 500, usageDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'log3', employeeName: 'John Doe', itemId: '5', itemName: 'Aluminum Plate', quantityUsed: 5, usageDate: new Date().toISOString() },
];

let settings: AppSettings = {
  phoneNumbers: ['+15551234567', '+15557654321'],
};

// --- API simulation functions ---

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Stock Items
export const getStockItems = async (): Promise<StockItem[]> => {
  await simulateDelay(500);
  return [...stockItems].sort((a, b) => a.name.localeCompare(b.name));
};

export const getStockItem = async (id: string): Promise<StockItem | undefined> => {
  await simulateDelay(300);
  return stockItems.find(item => item.id === id);
}

export const addStockItem = async (item: Omit<StockItem, 'id' | 'lastUpdated'>): Promise<StockItem> => {
  await simulateDelay(500);
  const newItem: StockItem = {
    ...item,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString(),
  };
  stockItems.push(newItem);
  return newItem;
};

export const updateStockItem = async (id: string, updateData: Partial<Omit<StockItem, 'id'>>): Promise<StockItem | null> => {
  await simulateDelay(500);
  const itemIndex = stockItems.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    stockItems[itemIndex] = { ...stockItems[itemIndex], ...updateData, lastUpdated: new Date().toISOString() };
    return stockItems[itemIndex];
  }
  return null;
};

export const deleteStockItem = async (id: string): Promise<{ success: boolean }> => {
  await simulateDelay(500);
  const initialLength = stockItems.length;
  stockItems = stockItems.filter(item => item.id !== id);
  return { success: stockItems.length < initialLength };
};

// Usage Logs
export const getUsageLogs = async (): Promise<UsageLog[]> => {
  await simulateDelay(500);
  return [...usageLogs].sort((a, b) => new Date(b.usageDate).getTime() - new Date(a.usageDate).getTime());
};

export const addUsageLog = async (log: Omit<UsageLog, 'id'>): Promise<UsageLog> => {
  await simulateDelay(500);
  // Transaction simulation
  const stockItem = stockItems.find(item => item.id === log.itemId);
  if (!stockItem) {
    throw new Error("Item not found");
  }
  if (stockItem.quantity < log.quantityUsed) {
    throw new Error("Insufficient stock");
  }
  stockItem.quantity -= log.quantityUsed;
  stockItem.lastUpdated = new Date().toISOString();
  
  const newLog: UsageLog = {
    ...log,
    id: Date.now().toString(),
  };
  usageLogs.push(newLog);
  return newLog;
};

// Settings
export const getSettings = async (): Promise<AppSettings> => {
  await simulateDelay(200);
  return { ...settings };
};

export const updateSettings = async (newSettings: AppSettings): Promise<AppSettings> => {
  await simulateDelay(500);
  settings = { ...newSettings };
  return { ...settings };
};
