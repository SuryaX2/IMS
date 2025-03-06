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
import supplierRouter from "./routes/supplier.routes.js";
import unitRouter from "./routes/unit.routes.js";
import productRouter from "./routes/product.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import orderRouter from "./routes/order.routes.js";
import reportRouter from "./routes/report.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reports", reportRouter);

// API : http://localhost:3001/api/v1/users - GET, POST, PATCH

// API : http://localhost:3001/api/v1/categories - GET, POST
// API : http://localhost:3001/api/v1/categories/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/customers - GET, POST
// API : http://localhost:3001/api/v1/customers/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/suppliers - GET, POST
// API : http://localhost:3001/api/v1/suppliers/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/units - GET, POST
// API : http://localhost:3001/api/v1/units/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/products - GET, POST
// API : http://localhost:3001/api/v1/products/:id - PATCH, DELETE

// API : http://localhost:3001/api/v1/purchases - GET, POST
// API : http://localhost:3001/api/v1/purchases/:id - GET, PATCH

// API : http://localhost:3001/api/v1/orders - GET, POST
// API : http://localhost:3001/api/v1/orders/:id - GET, PATCH

// API : http://localhost:3001/api/v1/reports/stock - GET
// API : http://localhost:3001/api/v1/reports/sales - GET
// API : http://localhost:3001/api/v1/reports/top-products - GET

app.use(errorHandler);
export { app };
