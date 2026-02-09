// Mock Data for Jakarta Warehouse System

export type ProductType = "pants" | "shirt" | "socks" | "jacket" | "hat";

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sku: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number; x: number; y: number };
  capacity: number;
  inventory: Product[];
}

export interface StoreRequest {
  id: string;
  storeName: string;
  requestDate: string;
  status: "pending" | "approved" | "shipped" | "delivered";
  items: {
    sku: string;
    productName: string;
    quantity: number;
  }[];
  warehouseId: string;
}

const generateInventory = (warehouseCode: string): Product[] => {
  return [
    {
      id: `${warehouseCode}-P1`,
      name: "Slim Fit Chinos",
      type: "pants",
      sku: "PNT-001-32",
      size: "32",
      price: 250000,
      quantity: Math.floor(Math.random() * 500),
    },
    {
      id: `${warehouseCode}-P2`,
      name: "Cargo Pants",
      type: "pants",
      sku: "PNT-002-34",
      size: "34",
      price: 280000,
      quantity: Math.floor(Math.random() * 500),
    },
    {
      id: `${warehouseCode}-S1`,
      name: "Cotton T-Shirt Basic",
      type: "shirt",
      sku: "SHR-001-L",
      size: "L",
      price: 95000,
      quantity: Math.floor(Math.random() * 1000),
    },
    {
      id: `${warehouseCode}-S2`,
      name: "Flannel Shirt",
      type: "shirt",
      sku: "SHR-002-M",
      size: "M",
      price: 185000,
      quantity: Math.floor(Math.random() * 600),
    },
    {
      id: `${warehouseCode}-SK1`,
      name: "Ankle Socks Pack",
      type: "socks",
      sku: "SCK-001-ALL",
      size: "One Size",
      price: 35000,
      quantity: Math.floor(Math.random() * 2000),
    },
    {
      id: `${warehouseCode}-J1`,
      name: "Denim Jacket",
      type: "jacket",
      sku: "JKT-001-XL",
      size: "XL",
      price: 450000,
      quantity: Math.floor(Math.random() * 200),
    },
    {
      id: `${warehouseCode}-H1`,
      name: "Snapback Cap",
      type: "hat",
      sku: "HAT-001-ALL",
      size: "Adj",
      price: 85000,
      quantity: Math.floor(Math.random() * 400),
    },
  ];
};

export const warehouses: Warehouse[] = [
  {
    id: "WH-JKT-01",
    name: "Gudang Pusat Cakung",
    location: "Cakung, Jakarta Timur",
    coordinates: { lat: -6.185, lng: 106.938, x: 78, y: 42 },
    capacity: 10000,
    inventory: generateInventory("WH1"),
  },
  {
    id: "WH-JKT-02",
    name: "Gudang Distribusi Priok",
    location: "Tanjung Priok, Jakarta Utara",
    coordinates: { lat: -6.104, lng: 106.88, x: 68, y: 25 },
    capacity: 8500,
    inventory: generateInventory("WH2"),
  },
  {
    id: "WH-JKT-03",
    name: "Hub Logistik Kebon Jeruk",
    location: "Kebon Jeruk, Jakarta Barat",
    coordinates: { lat: -6.197, lng: 106.769, x: 28, y: 48 },
    capacity: 5000,
    inventory: generateInventory("WH3"),
  },
  {
    id: "WH-JKT-04",
    name: "Penyimpanan Tebet",
    location: "Tebet, Jakarta Selatan",
    coordinates: { lat: -6.229, lng: 106.858, x: 56, y: 68 },
    capacity: 4000,
    inventory: generateInventory("WH4"),
  },
  {
    id: "WH-JKT-05",
    name: "Gudang Transit Tanah Abang",
    location: "Tanah Abang, Jakarta Pusat",
    coordinates: { lat: -6.187, lng: 106.811, x: 44, y: 50 },
    capacity: 6000,
    inventory: generateInventory("WH5"),
  },
];

export const mockRequests: StoreRequest[] = [
  {
    id: "REQ-2023-001",
    storeName: "Toko Baju Grand Indonesia",
    requestDate: "2023-10-25",
    status: "pending",
    warehouseId: "WH-JKT-05",
    items: [
      { sku: "SHR-001-L", productName: "Cotton T-Shirt Basic", quantity: 50 },
      { sku: "PNT-001-32", productName: "Slim Fit Chinos", quantity: 20 },
    ],
  },
  {
    id: "REQ-2023-002",
    storeName: "Distro Kemang",
    requestDate: "2023-10-24",
    status: "approved",
    warehouseId: "WH-JKT-04",
    items: [
      { sku: "JKT-001-XL", productName: "Denim Jacket", quantity: 15 },
      { sku: "HAT-001-ALL", productName: "Snapback Cap", quantity: 30 },
    ],
  },
  {
    id: "REQ-2023-003",
    storeName: "Pasar Senen Outlet",
    requestDate: "2023-10-23",
    status: "shipped",
    warehouseId: "WH-JKT-01",
    items: [
      { sku: "SCK-001-ALL", productName: "Ankle Socks Pack", quantity: 200 },
    ],
  },
  {
    id: "REQ-2023-004",
    storeName: "Mall Kelapa Gading Store",
    requestDate: "2023-10-22",
    status: "delivered",
    warehouseId: "WH-JKT-02",
    items: [{ sku: "SHR-002-M", productName: "Flannel Shirt", quantity: 100 }],
  },
];
