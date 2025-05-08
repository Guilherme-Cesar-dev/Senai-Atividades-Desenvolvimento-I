const express = require("express");
const fs = require("fs");
const cors = require("cors");

// Inicialização Express

const app = express();
const PORT = 3000;

// Configuração de Middlewares (conecta os dois front e back)

app.use(cors());
app.use(express.json());
