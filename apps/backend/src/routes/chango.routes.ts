import { Router } from "express";
import changoController from "../controllers/chango-controller";
import { authenticate } from "../middlewares/auth-middleware";

const router = Router();

router.use(authenticate);
router
	.post("/", changoController.addToChango)
	.get("/", changoController.getChango)
	.delete("/", changoController.clearChango)
	.delete("/:productId", changoController.removeFromChango);

export default router;
