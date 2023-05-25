//MongoDB
const { MongoClient, ObjectId } = require("mongodb");
async function connect() {
    if (global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://glucca520:Giorgi123@floricultura-produtos.sfze2d6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    if (!conn) return new Error("Can't connect!");
    global.db = await conn.db("floricultura-produtos");
    return global.db;
}

//configuração inicial
const express = require('express');
const app = express();
const port = 3000; //porta padrão

//forma de ler JSON / middlewares
app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
})

//rota / endpoint

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando' }));

//get produtos
router.get('/produtos/:id?', async function (req, res, next) {
    try {
        const db = await connect();
        if (req.params.id)
            res.json(await db.collection("produtos").findOne({ _id: new ObjectId(req.params.id) }));
        else
            res.json(await db.collection("produtos").find().toArray());
    }
    catch (ex) {
        console.log(ex);
        res.status(400).json({ erro: `${ex}` });
    }
})

//post produtos
router.post('/produtos', async function (req, res, next) {
    try {
        const produtos = req.body;
        const db = await connect();
        res.json(await db.collection("produtos").insertOne(produtos));
    }
    catch (ex) {
        console.log(ex);
        res.status(400).json({ erro: `${ex}` });
    }
})

//put produtos
router.put('/produtos/:id', async function (req, res, next) {
    try {
        const produtos = req.body;
        const db = await connect();
        res.json(await db.collection("produtos").updateOne({ _id: new ObjectId(req.params.id) }, { $set: produtos }));
    }
    catch (ex) {
        console.log(ex);
        res.status(400).json({ erro: `${ex}` });
    }
})

//delete produtos
router.delete('/produtos/:id', async function (req, res, next) {
    try {
        const db = await connect();
        res.json(await db.collection("produtos").deleteOne({ _id: new ObjectId(req.params.id) }));
    }
    catch (ex) {
        console.log(ex);
        res.status(400).json({ erro: `${ex}` });
    }
})

app.use('/', router);

//entregar uma rota
app.listen(port);
console.log("API Funcionando!")