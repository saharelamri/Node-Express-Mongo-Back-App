"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = __importDefault(require("./book"));
const body_parser_1 = __importDefault(require("body-parser"));
const serve_static_1 = __importDefault(require("serve-static"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
/* Instancier Express */
const app = express_1.default();
/* Middleware bodyParser pour parser le corps des requêtes en Json*/
app.use(body_parser_1.default.json());
/* Middlware pour configurer le dossier des ressources statique*/
app.use(serve_static_1.default("public"));
/* Actvier CORS*/
app.use(cors_1.default());
/* Connection à MongoDb*/
const uri = "mongodb://localhost:27017/biblio";
mongoose_1.default.connect(uri, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Mongo db connection sucess");
    }
});
/* Requête HTTP GET http://localhost:8700/ */
app.get("/", (req, resp) => {
    resp.send("Hello world");
});
/* Requête HTTP GET http://localhost:8700/books */
app.get("/books", (req, resp) => {
    book_1.default.find((err, books) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(books);
        }
    });
});
/* Requête HTTP GET http://localhost:8700/books/id */
app.get("/books/:id", (req, resp) => {
    book_1.default.findById(req.params.id, (err, book) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(book);
        }
    });
});
/* Requête HTTP POST http://localhost:8700/books */
app.post("/books", (req, resp) => {
    let book = new book_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
/* Requête HTTP PUT http://localhost:8700/books/id */
app.put("/books/:id", (req, resp) => {
    book_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else {
            resp.send("Successfuly updated book");
        }
    });
});
/* Requête HTTP DELETE http://localhost:8700/books/id */
app.delete("/books/:id", (req, resp) => {
    book_1.default.deleteOne({ _id: req.params.id }, err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Successfuly deleted Book");
    });
});
/* Requête HTTP GET http://localhost:8700/pbooks?page=0&size=5 */
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page || '1');
    let size = parseInt(req.query.size || '5');
    book_1.default.paginate({}, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
app.get("/books-serach", (req, resp) => {
    let p = parseInt(req.query.page || '1');
    let size = parseInt(req.query.size || '5');
    let keyword = req.query.kw || '';
    book_1.default.paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
/* Démarrer le serveur*/
app.listen(8700, () => {
    console.log("Server Started on port %d", 8700);
});
