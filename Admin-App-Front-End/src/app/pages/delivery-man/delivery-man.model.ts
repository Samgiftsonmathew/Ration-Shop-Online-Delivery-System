import { Region } from '../../models/region.model';

export interface DeliveryMan {
  id?: number;
  name: string;
  phoneNO: number;
  aadharNum: number;
  region: Region; // ✅ not number | Region
}
