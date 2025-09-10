import express from "express";
import { routes } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
