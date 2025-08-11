export interface Chango {
  id: string;
  userId: string;
  item: Comprando[];
}

export interface Comprando {
  productId: string;
  quantity: number;
}
