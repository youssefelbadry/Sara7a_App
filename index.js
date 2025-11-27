import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env.dev" });
const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
