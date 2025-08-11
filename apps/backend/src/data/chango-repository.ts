import { Chango } from "@domain/src/entities/Chango";
import { changoDB } from "../database/chango-db";

const findChangoByUserId = async (userId: string): Promise<Chango | null> => {
  return changoDB.find((chango) => chango.userId === userId) || null;
};

const saveChango = async (chango: Chango): Promise<Chango> => {
  const existingIndex = changoDB.findIndex((c) => c.id === chango.id);
  if (existingIndex !== -1) {
    changoDB[existingIndex] = chango;
  } else {
    changoDB.push(chango);
  }
  return chango;
};

const clearChango = async (userId: string): Promise<boolean> => {
  const index = changoDB.findIndex((chango) => chango.userId === userId);
  if (index !== -1) {
    changoDB.splice(index, 1);
    return true;
  }
  return false;
};

const removeChangoItem = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const chango = await findChangoByUserId(userId);
  if (chango) {
    const itemIndex = chango.item.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex !== -1) {
      chango.item.splice(itemIndex, 1);
      await saveChango(chango);
      return true;
    }
  }
  return false;
};

export default {
  findChangoByUserId,
  saveChango,
  clearChango,
  removeChangoItem,
};