export interface Product {
  stockQuantity: number;
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  allocations: {
    cardType: string;
    defaultLimit: number;
    stockByRegion: {
      [region: string]: number;
    };
  }[];
}
