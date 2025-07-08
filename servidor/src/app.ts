import { obtenerUsuario } from "./controllers/users";
import express from "express" //Importando el framework express
import { Request, Response } from "express";

require("dotenv").config(); //Cargar variables de entorno locales
const cors = require("cors"); //Importando el middleware CORS
const app = express(); // Creando una instancia de Express

app.use(cors()); // Habilitando el uso de CORS para todas las rutas API

const PORT = process.env.PORT || 8000; // Configurando el puerto desde las variables de entorno

app.use(express.json()); // Parsea las peticiones restantes de tipo JSOn y permite responder en el mismo formato

app.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
}); //Levantando un mensaje si el servidor esta corriendo
app.get("/usuarios", obtenerUsuario)