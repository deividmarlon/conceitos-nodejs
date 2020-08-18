const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request,response,next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);

}

app.use(logRequests);

function validateRepository(request,response,next){
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex >=0 ){
      return next();
    }

    return response.status(400).send();
}

app.get("/repositories", (request, response) => {
    
    return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", validateRepository, (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex>=0){
      repositories[repositoryIndex].title = title;
      repositories[repositoryIndex].url = url;
      repositories[repositoryIndex].techs = techs;
      
      return response.status(200).json(repositories[repositoryIndex]);
    }

    return response.status(400).json({message: 'Error to update!'});
});

app.delete("/repositories/:id", validateRepository, (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    
    if(repositoryIndex>=0){
      repositories.splice(repositoryIndex, 1);
      return response.status(204).send();
    }

    else{
      return response.status(400).json({error: 'Project not Found!'});
    }
});

app.post("/repositories/:id/like",validateRepository, (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex>=0){
      repositories[repositoryIndex].likes += 1;
     
      return response.status(200).json(repositories[repositoryIndex]);
    }

    return response.status(400).json({message: 'Error to update!'});
});

module.exports = app;
