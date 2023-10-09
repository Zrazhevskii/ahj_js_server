const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body').default;
const Router = require('koa-router');
const app = new Koa();
const PORT = 3500;
const router = new Router();
const file = require('./filereader.js');

app.use(cors());
app.use(koaBody())

router.get('/', async (ctx) => {
    ctx.body = 'ок';
});

// Получаем все тикеты
router.get('/tasks', async (ctx) => {
    ctx.type = 'text/json';
    ctx.body = file.getData();
});

// Получаем конкретный task
router.get('/task/:id', async (ctx) => {
    ctx.type = 'text/json';
    let tasks = file.getData();
    let id = parseInt(ctx.params.id);
    let task = tasks.filter((task) => task.id === id);
    if (task) {
        ctx.body = task[0];
    } else {
        ctx.status = 500;
        ctx.body = 'Таск не найден.';
    }
});

// удаление task
router.get('/remove-task/:id', async (ctx) => {
    ctx.type = 'text/json';
    let id = parseInt(ctx.params.id);
    let data = file.getData()

    let newTasks = data.filter((task) => task.id !== id);
    
    file.setData(newTasks);

    ctx.body = {status: 'OK'};
});

//добавление task
router.post('/add-task', async (ctx) => {
    ctx.type = 'text/json';
    let data = ctx.request.body;
    let tasks = file.getData();
       
    if (data.id !== '') {
        tasks[parseInt(data.id) - 1]['name'] = data.shortDescription;
        tasks[parseInt(data.id) - 1]['description'] = data.fullDescription;
    } else {
        let curruntDate = new Date();
        
        let newDate = curruntDate.getDate();
        newDate = newDate < 10 ? '0' + newDate : newDate;
        let newMonth = curruntDate.getMonth();
        newMonth = newMonth < 10 ? '0' + newMonth : newMonth;
        let newYear = curruntDate.getFullYear();
        newYear = newYear < 10 ? '0' + newYear : newYear;

        let id = tasks.length + 1;
        let newTask = {
            "id": id,
            "name": data.shortDescription,
            "description": data.fullDescription,
            "status": false,
            "created": newDate + "." + newMonth + "." + newYear
        };

        tasks.push(newTask);
    }
    file.setData(tasks);
    ctx.body = {status: 'OK'};
});

router.get('/status/:id', async (ctx) => {
    ctx.type = 'text/json';
    let id = ctx.params.id;
    let tasks = file.getData();
    tasks[id - 1]['status'] = false ? tasks[id - 1]['status'] == true : tasks[id - 1]['status'] == false;

    file.setData(tasks);
    ctx.body = {status: 'OK'};
})
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(
        `Сервер запущен и работает по адресу: http://localhost:${PORT}`
    );
});

