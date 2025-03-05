import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import customerRouter from "./routes/customer.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/customers", customerRouter);

// API : http://localhost:3001/api/v1/users - GET, POST, PATCH

// API : http://localhost:3001/api/v1/categories - GET, POST
// API : http://localhost:3001/api/v1/categories/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/customers - GET, POST
// API : http://localhost:3001/api/v1/customers/:id - PATCH, DELETE

app.use(errorHandler);
export { app };
