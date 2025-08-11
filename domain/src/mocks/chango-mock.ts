import { Chango } from "../entities/Chango";
import { ChangoRepository } from "../repositories/chango-repository";

export interface MockedChangoRepository extends ChangoRepository {
  changos: Chango[];
}

export function mockChangoRepository(): MockedChangoRepository {
  const changos: Chango[] = [];

  return {
    changos,
    findChangoByUserId(userId: string): Chango | undefined {
      return changos.find((chango) => chango.userId === userId);
    },
    saveChango(chango: Chango): void {
      const index = changos.findIndex((c) => c.id === chango.id);
      if (index !== -1) {
        changos[index] = chango;
      } else {
        changos.push(chango);
      }
    },
    clearChango(userId: string): boolean {
      const index = changos.findIndex((chango) => chango.userId === userId);
      if (index !== -1) {
        changos.splice(index, 1);
        return true;
      }
      return false;
    },

    removeChangoItem(userId: string, productId: string): boolean {
      const chango = changos.find((c) => c.userId === userId);
      if (chango) {
        const itemIndex = chango.item.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) {
          chango.item.splice(itemIndex, 1);
          return true;
        }
      }
      return false;
    },  
  };
}