import express from "express";
import "dotenv/config";

import { router } from "./router";

// Staring app
const PORT = 3000;
const app = express();

// Configuring app
app.use(express.json());
app.use(router);

// Activating app
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
