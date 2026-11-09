import { OrderItem } from './order-item';

export class Order {
  id!: number;
  customerId!: number;
  subAdminId!: number;
  status!: string;
  createdAt!: string; // ISO date string
  deliveryDate!: string; // ISO date string
  totalPrice!: number;
  items!: OrderItem[];
}
