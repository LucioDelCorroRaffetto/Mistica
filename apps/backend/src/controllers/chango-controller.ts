import { Request, Response } from "express";
import { AuthenticatedRequest } from "@domain/src/validations/auth-type";
import changoService from "../services/chango-service";

const addToChango = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos obligatorios: productId, quantity",
    });
  }

  try {
    const updatedChango = await changoService.addToChango({
      userId,
      productId,
      quantity,
    });
    return res.status(200).json({ ok: true, payload: updatedChango });
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: (error as Error).message });
  }
};

const getChango = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;
  try {
    const chango = await changoService.getChangoByUserId(userId);
    return res.status(200).json({ ok: true, payload: chango });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ ok: false, message: errorMessage });
  }
};

const removeFromChango = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productId } = req.params;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const updatedChango = await changoService.removeFromChango(userId, productId);

    if (!updatedChango) {
      return res.status(404).json({
        ok: false,
        message: "El chango del usuario no se encontró",
      });
    }

    return res.status(200).json({ ok: true, payload: updatedChango });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

const clearChango = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const success = await changoService.clearChango(userId);

    if (!success) {
      return res.status(404).json({
        ok: false,
        message: "El chango del usuario no se encontró",
      });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Carrito vaciado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export default { addToChango, getChango, removeFromChango, clearChango };