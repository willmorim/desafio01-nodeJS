const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

//middleware que verifica se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  //pega o id do projeto
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//middleware que verifica as requisições
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//cria novos projetos
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//retorna todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//alterar o titulo do projeto passando o ID na rota
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

//deletar o projeto com o ID presente na rota
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//alterar o titulo da task
server.post("/projects/:id/:tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
