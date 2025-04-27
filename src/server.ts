import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    //console.log(colors.blue("Conexión exitosa a la bd"));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold("Error en conexión a la base de datos"));
  }
}

connectDB();
const server = express();
const corsOptions: CorsOptions = {
  origin: function (origin, callBack) {
    if (origin === process.env.FRONTEND_URL) {
      callBack(null, true);
    } else {
      callBack(new Error("Error de Cors"));
    }
  },
};
server.use(cors(corsOptions));
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router);

//docs
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;
