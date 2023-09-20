import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.Routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
config();

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/ping", (req, res) => {
  res.send("Hello World!!");
});

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("*", (req, res) => {
  res.status(404).send("URL Not Found!!");
});

app.use(errorMiddleware);

export default app;
