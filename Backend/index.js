import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path: "./.env",
});

app.get("/", (req, res) => {
    res.send("<h1>Hello World !!</h1>");
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`✅ Server listening on http://localhost:${process.env.PORT}/`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    });
