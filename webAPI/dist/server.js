"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("@koa/cors");
const http_status_codes_1 = require("http-status-codes");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const people = [{ name: 'Adam' }, { name: 'Eve' }];
const todos = [];
let lastId = 0;
const router = new Router();
router.get('/api/people', async (context) => {
    // Return people
    context.body = people;
});
router.get('/api/todos', async (context) => {
    // Return todo items
    context.body = todos;
});
router.get('/api/todos/:id', async (context) => {
    // Check if todo item exists
    const todoItem = todos.find(i => i.id == context.params.id);
    if (!todoItem) {
        context.status = http_status_codes_1.NOT_FOUND;
    }
    else {
        context.body = todoItem;
    }
});
router.post('/api/todos', async (context) => {
    const body = context.request.body;
    if (!body.description) {
        // description field is mandatory
        context.status = http_status_codes_1.BAD_REQUEST;
        context.body = { description: 'Missing description' };
        return;
    }
    const newItem = { id: lastId++, description: body.description };
    // Check if assigned-to person exists
    if (body.assignedTo) {
        if (people.find(p => p.name === body.assignedTo)) {
            newItem.assignedTo = body.assignedTo;
        }
        else {
            context.status = http_status_codes_1.NOT_FOUND;
            context.body = { description: 'Unknown person' };
            return;
        }
    }
    todos.push(newItem);
    context.set('location', `/api/todos/${newItem.id}`);
    context.status = http_status_codes_1.CREATED;
    context.body = newItem;
});
router.patch('/api/todos/:id', async (context) => {
    // Check if todo item exists
    const todoItem = todos.find(i => i.id == context.params.id);
    if (!todoItem) {
        context.status = http_status_codes_1.NOT_FOUND;
        return;
    }
    const body = context.request.body;
    // Update description if specified
    if (body.description) {
        todoItem.description = body.description;
    }
    // Update done if specified
    if (body.done === true || body.done === false) {
        todoItem.done = body.done;
    }
    // Update assigned-to if specified
    if (body.assignedTo) {
        // Check if assigned-to person exists
        if (people.find(p => p.name === body.assignedTo)) {
            todoItem.assignedTo = body.assignedTo;
        }
        else {
            context.status = http_status_codes_1.NOT_FOUND;
            context.body = { description: 'Unknown person' };
            return;
        }
    }
    context.body = todoItem;
});
router.delete('/api/todos/:id', async (context) => {
    // Check if todo item exists
    const todoItemIndex = todos.findIndex(i => i.id == context.params.id);
    if (todoItemIndex === (-1)) {
        context.status = http_status_codes_1.NOT_FOUND;
        return;
    }
    todos.splice(todoItemIndex, 1);
    context.status = http_status_codes_1.NO_CONTENT;
});
const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.listen(8080);
//# sourceMappingURL=server.js.map