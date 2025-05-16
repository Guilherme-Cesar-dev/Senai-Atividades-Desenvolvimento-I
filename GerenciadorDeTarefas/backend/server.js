const express = require("express"); 
const fs = require("fs");
const cors = require("cors");

// Inicialização Express

const app = express();
const PORT = 3000;

// Configuração de Middlewares (conecta os dois front e back)

app.use(cors());
app.use(express.json());

// Caminho do arquivo de dados 

const FILE_PATH = "./tasks.json";

function readTasks() {
    if(!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, "[]");
    return JSON.parse(fs.readFileSync(FILE_PATH));
};

function writeTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
};

// Definição de rotas

app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

app.get("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id == req.params.id);
    task ? res.json(task) : res.status(404).json({ message: "Task not found"});
});

app.post("/tasks", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now(), 
        title: req.body.title,
        description: req.body.description || "",
        completed: false,
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id == req.params.id);

    if(taskIndex === -1) return res.status(404).json({message:"Task not found"});
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body};
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter((t) => t.id != req.params.id);
    writeTasks(tasks);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));