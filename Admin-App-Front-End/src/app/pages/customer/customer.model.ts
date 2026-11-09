export interface Customer {
  id?: number;
  name: string;
  email: string;
  smartcardNo: string;
  phone: string;
  address: string;
  cardType: string;
  createdDate: string;
  regionId: number; // ✅ used for binding selected region
  role: string; // e.g., 'USER'
  region?: Region; // Optional: used if backend sends region object
  orders?: Order[]; // Optional: used in customer detail view
}

export interface Region {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
}
