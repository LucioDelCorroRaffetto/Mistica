import { v4 as uuid } from "uuid";
import changoRepository from "../data/chango-repository";
import { Chango, Comprando } from "@domain/src/entities/Chango";

interface AddToChangoInput {
  userId: string;
  productId: string;
  quantity: number;
  productName?: string;
  productPrice?: number;
}

const addToChango = async (
  input: AddToChangoInput
): Promise<Chango> => {
  let chango = await changoRepository.findChangoByUserId(input.userId);

  if (!chango) {
    chango = {
      id: uuid(),
      userId: input.userId,
      item: [],
    };
  }

  const existingItem = chango.item.find((item) => item.productId === input.productId);

  if (existingItem) {
    existingItem.quantity += input.quantity;
  } else {
    const newItem: Comprando = {
      productId: input.productId,
      quantity: input.quantity,
    };
    chango.item.push(newItem);
  }

  return await changoRepository.saveChango(chango);
};

const getChangoByUserId = async (userId: string) => {
  return changoRepository.findChangoByUserId(userId);
};

const removeFromChango = async (userId: string, productId: string) => {
  return changoRepository.removeChangoItem(userId, productId);
};

const clearChango = async (userId: string) => {
  return changoRepository.clearChango(userId);
};

export default {
  addToChango,
  getChangoByUserId,
  removeFromChango,
  clearChango,
};