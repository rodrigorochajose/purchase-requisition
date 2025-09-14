const express = require("express");
import { routes } from "./routes/index";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
