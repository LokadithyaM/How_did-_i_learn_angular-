const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

let tasks = [];
let currentId = 1;

app.get('/tasks', (req,res)=>{
    res.json(tasks);
});

app.post('/tasks', (req,res)=>{
    const {title,description} = req.body;
    const newTask = {
        id: currentId++,
        title,
        description,
        completed: false
    }
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.get('/tasks/:id', (req,res)=>{
    const task = task.find(t=> t.id === parseInt(req.params.id));
    if(!task) return res.status(404).json({message: 'Task not found'});
    res.json(task);
});

app.put('/tasks/:id', (req,res)=>{
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if(!task) return res.status(404).json({message: 'Task not found'});

    const {title,description,completed} = req.body;
    if(title!==undefined) task.title = title;
    if(description!==undefined) task.description = description;
    if(completed!==undefined) task.completed = completed;

    res.json(task);
});

app.delete('/tasks/:id', (req,res)=>{
    const taskIndex = tasks.findIndex(t=> t.id === parseInt(req.params.id));
    if(taskIndex===-1) return res.status(404).json({message: 'Task not found'});
    tasks.splice(taskIndex,1);
    res.status(204).send();
});

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
});
