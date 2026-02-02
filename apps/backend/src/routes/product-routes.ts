import { Router } from "express";
import productController from "../controllers/product-controller";
import { authenticate, authorize } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProductById);

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  productController.createProduct
);
router.put(
  "/:productId",
  authenticate,
  authorize(["admin"]),
  productController.updateProduct
);
router.delete(
  "/:productId",
  authenticate,
  authorize(["admin"]),
  productController.deleteProduct
);

export default router;