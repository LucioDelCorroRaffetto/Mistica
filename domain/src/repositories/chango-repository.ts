import { Chango } from "../entities/Chango";

export interface ChangoRepository {
  findChangoByUserId(userId: string): Chango | undefined;
  saveChango(chango: Chango): void;
  clearChango(userId: string): boolean;
  removeChangoItem(userId: string, productId: string): boolean;
}