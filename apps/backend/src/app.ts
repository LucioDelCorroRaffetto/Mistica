import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product-routes";
import authRoutes from "./routes/auth-routes";
import cartRoutes from "./routes/cart-routes";
import filterRoutes from "./routes/filter-routes";
import recommendationRoutes from "./routes/recommendation-routes";
import paymentRoutes from "./routes/payment-routes";
import { reviewsRouter } from "./controllers/reviews-controller";
import { wishlistRouter } from "./controllers/wishlist-controller";
import { ordersRouter } from "./controllers/orders-controller";
import { readingListsRouter } from "./controllers/reading-lists-controller";
import { couponsRouter } from "./controllers/coupons-controller";
import { rewardsRouter } from "./controllers/rewards-controller";
import { notificationsRouter } from "./controllers/notifications-controller";

const app = express();

const allowedOrigins = [
  process.env.BASE_URL || "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API RESTful TypeScript & Express",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/products", reviewsRouter);
app.use("/api", wishlistRouter);
app.use("/api", ordersRouter);
app.use("/api", readingListsRouter);
app.use("/api", couponsRouter);
app.use("/api", rewardsRouter);
app.use("/api", notificationsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `No se encontró la ruta '${req.originalUrl}'`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
});

export default app;