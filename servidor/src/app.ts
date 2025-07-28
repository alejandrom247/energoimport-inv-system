import computerRouter from "./routes/computers";
import departmentRouter from "./routes/department";
import tasksRouter from "./routes/tasks";
import userRouter from "./routes/users";
import motherboardRouter from "./routes/motherboard"
import keyboardRouter from "./routes/keyboards";
import cpuRouter from "./routes/cpu";
import monitorRouter from "./routes/monitor";
import express from "express" //Importando el framework express


require("dotenv").config(); //Cargar variables de entorno locales
const cors = require("cors"); //Importando el middleware CORS
const app = express(); // Creando una instancia de Express

app.use(cors()); // Habilitando el uso de CORS para todas las rutas API

const PORT = process.env.PORT || 8000; // Configurando el puerto desde las variables de entorno

app.use(express.json()); // Parsea las peticiones restantes de tipo JSOn y permite responder en el mismo formato

app.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
}); //Levantando un mensaje si el servidor esta corriendo

app.use("/api/v1", userRouter);
app.use("/api/v1", tasksRouter);
app.use("/api/v1", departmentRouter);
app.use("/api/v1", computerRouter);
app.use("/api/v1", motherboardRouter);
app.use("/api/v1", keyboardRouter);
app.use("/api/v1", cpuRouter);
app.use("/api/v1", monitorRouter)