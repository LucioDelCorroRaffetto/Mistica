import { ChangoRepository } from "../repositories/chango-repository";

export async function clearChango(
  userId: string,
  repository: ChangoRepository
): Promise<boolean> {
  return repository.clearChango(userId);
}