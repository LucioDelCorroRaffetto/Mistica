import api from "./api";
import type { AddToChangoRequest } from "@backend-types/type";
import type { Chango } from "@domain/entities/Chango";

export const addToChango = async (request: AddToChangoRequest) => {
  const response = await api.post(`/chango`, request);
  return response.data;
};

export const getChango = async (): Promise<Chango> => {
  const response = await api.get(`/chango`);
  return response.data.payload;
};

export const removeFromChango = async (productId: string): Promise<Chango> => {
  const response = await api.delete(`/chango/${productId}`);
  return response.data.payload;
};

export const clearChango = async (): Promise<void> => {
  await api.delete("/chango");
};