export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  quantityKg?: number;
  minStockLimit: number;
  location: string;
  lastUpdated: string;
}

export interface UsageLog {
  id: string;
  employeeName: string;
  itemId: string;
  itemName: string;
  quantityUsed?: number;
  quantityKgUsed?: number;
  usageDate: string;
}

export interface AppSettings {
  phoneNumbers: string[];
}
