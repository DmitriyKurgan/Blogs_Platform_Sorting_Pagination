import express from "express";
import bodyParser from "body-parser";
import {blogsRouter} from "./routers/blogsRouter";
import {postsRouter} from "./routers/postsRouter";
import {testingRouter} from "./routers/testingRouter";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing/all-data', testingRouter);
