import express, {Request, Response} from 'express';
import Book from "./book";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import cors from "cors";
/* Instancier Express */
const app=express();
/* Middleware bodyParser pour parser le corps des requêtes en Json*/
app.use(bodyParser.json());
/* Middlware pour configurer le dossier des ressources statique*/
app.use(serveStatic("public"));
/* Actvier CORS*/
app.use(cors());
/* Connection à MongoDb*/
const uri:string="mongodb://localhost:27017/biblio";
mongoose.connect(uri,(err)=>{
if(err){ console.log(err); }
else{ console.log("Mongo db connection sucess"); }
});

/* Requête HTTP GET http://localhost:8700/ */
app.get("/",(req:Request,resp:Response)=>{
    resp.send("Hello world");
    });
    /* Requête HTTP GET http://localhost:8700/books */
    app.get("/books",(req:Request,resp:Response)=>{
    Book.find((err,books)=>{
    if(err){ resp.status(500).send(err); }
    else{ resp.send(books); }
    })
    });
    /* Requête HTTP GET http://localhost:8700/books/id */
    app.get("/books/:id",(req:Request,resp:Response)=>{
    Book.findById(req.params.id,(err,book)=>{
    if(err){ resp.status(500).send(err); }
    else{ resp.send(book); }
    });
    });
    /* Requête HTTP POST http://localhost:8700/books */
app.post("/books",(req:Request,resp:Response)=>{
    let book=new Book(req.body);
    book.save(err=>{
    if (err) resp.status(500).send(err);
    else resp.send(book);
    })
    });
    /* Requête HTTP PUT http://localhost:8700/books/id */
    app.put("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err,book)=>{
    if (err) resp.status(500).send(err);
    else{
    resp.send("Successfuly updated book");
    }
    })
    });
    /* Requête HTTP DELETE http://localhost:8700/books/id */
app.delete("/books/:id",(req:Request,resp:Response)=>{
    Book.deleteOne({_id:req.params.id},err=>{
    if(err) resp.status(500).send(err);
    else resp.send("Successfuly deleted Book");
    });
    });
    
    /* Requête HTTP GET http://localhost:8700/pbooks?page=0&size=5 */
    app.get("/pbooks",(req:Request,resp:Response)=>{
        let p:number=parseInt(req.query.page as string || '1');
        let size:number=parseInt(req.query.size as string|| '5');
        Book.paginate({}, { page: p, limit: size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
        });
        });
    app.get("/books-serach",(req:Request,resp:Response)=>{
        let p:number=parseInt(req.query.page as string|| '1');
        let size:number=parseInt(req.query.size as string|| '5');
        let keyword:string=req.query.kw as string || '';
        Book.paginate({title:{$regex:".*(?i)"+keyword+".*"}}, { page: p, limit:
        size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
        });
        });
    /* Démarrer le serveur*/
    app.listen(8700,()=>{
    console.log("Server Started on port %d",8700);
    });
  