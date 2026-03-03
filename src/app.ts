import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/AuthRoute";
import clientesRoutes from "./routes/ClientesRouter";
import processoRoutes from "./routes/ProcessoRouter";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://cool-test-products.netlify.app"],
  })
);

app.use(express.json());

app.use(authRoutes);
app.use(clientesRoutes);
app.use(processoRoutes)

export default app;