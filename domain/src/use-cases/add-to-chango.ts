import { Chango } from "../entities/Chango";
import { ChangoRepository } from "../repositories/chango-repository";

export interface AddToChangoRequest {
  userId: string;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
}

export async function AddToChango(
  request: AddToChangoRequest,
  repository: ChangoRepository
): Promise<Chango> {
  let chango = repository.findChangoByUserId(request.userId);
  validateAddToChangoData(request);

  if (!chango) {
    chango = {
      id: `chango-${Date.now()}`,
      userId: request.userId,
      item: [],
    };
    repository.saveChango(chango);
  }

  const existingItem = chango.item.find(
    (item) => item.productId === request.productId
  );

  if (existingItem) {
    existingItem.quantity += request.quantity;
  } else {
    chango.item.push({
      productId: request.productId,
      quantity: request.quantity,
    });
  }

  repository.saveChango(chango);

  return chango;
}

function validateAddToChangoData(request: AddToChangoRequest): void {
  if (!request.userId.trim()) {
    throw new Error("User ID is required");
  }
  if (!request.productId.trim()) {
    throw new Error("Product ID is required");
  }
  if (!request.productName.trim()) {
    throw new Error("Product name is required");
  }
  if (!request.productPrice.trim()) {
    throw new Error("Product price is required");
  }
  if (request.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
}