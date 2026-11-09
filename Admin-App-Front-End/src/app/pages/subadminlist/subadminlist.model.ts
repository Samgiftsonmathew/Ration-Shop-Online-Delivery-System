export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  smartcardNo: string | null;
  role: string;
  cardType: string | null;
  address: string;
  regionId: number | null;
  region?: Region;

  [key: string]: any; 
}


export interface Region {
  id: number;
  name: string;
}