require("dotenv").config();
import express from "express";
import config from "config";
import routes from "./routes";
import log from "./utils/logger";

const app = express();

//middlewares
app.use(express.json());
const port = config.get("port");

app.use("/api", routes);

app.listen(port, () => {
  log.info(`Server started on port ${port}`);
});
