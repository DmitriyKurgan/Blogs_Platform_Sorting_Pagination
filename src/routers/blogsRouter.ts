import {Request, Response, Router} from "express";
import {blogs, blogsService} from "../services/blogs-service";
import {CodeResponsesEnum} from "../utils/utils";
import {OutputBlogType, OutputPostType} from "../utils/types";
import {validateAuthorization, validateBlogsRequests, validateErrorsMiddleware} from "../middlewares/middlewares";
import {posts, postsService} from "../services/posts-service";
import {findAllPostsByBlogId} from "../repositories/query-repositories/blogs-query-repository";
import mongoose, { Schema, Model, Document } from 'mongoose';
import any = jasmine.any;
export const blogsRouter = Router({});

blogsRouter.get('/', (req:Request, res:Response)=>{
    res.send(blogs).status(CodeResponsesEnum.OK_200);
});

blogsRouter.get('/:id', async (req:Request, res:Response)=>{
   const blogID = req.params.id;
   const blogByID = await blogsService.findBlogByID(blogID);
   if(!blogID || !blogByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404);
   }
   res.status(CodeResponsesEnum.OK_200).send(blogByID);
});


const postSchema = new Schema({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName:String,
    createdAt: String
});

export const PostModel: any = mongoose.model('Post', postSchema);


blogsRouter.get('/:id/posts', async (req:Request, res:Response)=>{
     const blogID = req.params.id;
     const blogByID:OutputBlogType|null = await blogsService.findBlogByID(blogID);
    if(!blogID || !blogByID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const Post = new PostModel();
    const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy as string : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection as "asc" | "desc" : "desc";
    const searchTitleTerm = req.query.searchTitleTerm ? req.query.searchTitleTerm as string : undefined;

    // Вызываем метод findAllPostsByBlogId с передачей всех параметров
    const posts = await findAllPostsByBlogId(Post, blogID, pageNumber, pageSize, sortBy, sortDirection, searchTitleTerm);

    if (!posts || !posts.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }

    res.status(CodeResponsesEnum.OK_200).send(posts);
});

blogsRouter.post('/', validateAuthorization, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const newBlog: OutputBlogType|null = await blogsService.createBlog(req.body);
    if (newBlog){
        blogs.push(newBlog);
        res.status(CodeResponsesEnum.Created_201).send(newBlog);
    }
});

blogsRouter.post('/:id/posts', validateAuthorization, validateBlogsRequests, async (req:Request, res:Response)=>{
    const blogID = req.params.id;
    const blogByID:OutputBlogType|null = await blogsService.findBlogByID(blogID);
    if(!blogID || !blogByID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);
        return
    }
    debugger
    const newPost: OutputPostType|null = await postsService.createPost(req.body, blogByID.name, blogID);
    if (newPost){
        posts.push(newPost);
        res.status(CodeResponsesEnum.Created_201).send(newPost);
    }
});

blogsRouter.put('/:id', validateAuthorization, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const blogID = req.params.id;
    const isUpdated:boolean = await blogsService.updateBlog(blogID, req.body);
    if (!isUpdated || !blogID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);

    }
    const blog = await blogsService.findBlogByID(blogID);
    res.status(CodeResponsesEnum.Not_content_204).send(blog);
});

blogsRouter.delete('/:id', validateAuthorization, validateErrorsMiddleware,async (req:Request, res:Response)=>{
    const blogID:string = req.params.id;
    const isDeleted:boolean = await blogsService.deleteBlog(blogID);
    if (!isDeleted || !blogID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


