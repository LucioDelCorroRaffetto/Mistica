import { ChangoRepository } from "../repositories/chango-repository";

export interface RemoveFromChangoRequest {
  userId: string;
  productId: string;
}

export async function removeFromChango(
  request: RemoveFromChangoRequest,
  repository: ChangoRepository
): Promise<boolean> {
  const { userId, productId } = request;
  return repository.removeChangoItem(userId, productId);
}