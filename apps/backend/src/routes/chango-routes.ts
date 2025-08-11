import { Router } from "express";
import changoController from "../controllers/chango-controller";
import { authenticate } from "../middlewares/auth-middleware";

const router = Router();

router.use(authenticate);
router
  .post("/", changoController.addToCart)
  .get("/", changoController.getCart)
  .delete("/", changoController.clearCart)
  .delete("/:productId", changoController.removeFromCart);

export default router;