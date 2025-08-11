import { Chango } from "../entities/Chango";
import { ChangoRepository } from "../repositories/chango-repository";

/**
 * @param userId
 * @param repository
 * @returns
 */
export async function getChango(
  userId: string,
  repository: ChangoRepository
): Promise<Chango | null> {
  const chango = repository.findChangoByUserId(userId);
  return chango || null;
}