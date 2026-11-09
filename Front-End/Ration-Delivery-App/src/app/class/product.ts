export class Product {
  //db properties
  id!: number;
  name!: string;
  defaultLimit!: number;
  imageUrl!: string;
  price!: number;
  category!: string;
  allocatedQuantity!:number
  //cart only properties
  quantity?: number;
  selected?: boolean;
  cardType?: string;

  disabled: boolean = false;
}
