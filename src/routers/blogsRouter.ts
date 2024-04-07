import {Request, Response, Router} from "express";
import {blogs, blogsService} from "../services/blogs-service";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {OutputBlogType, OutputPostType} from "../utils/types";
import {
    validateAuthorization,
    validateBlogsRequests,
    validateErrorsMiddleware,
    validationPostsCreation
} from "../middlewares/middlewares";
import {posts, postsService} from "../services/posts-service";
import {findAllPostsByBlogID} from "../repositories/query-repositories/posts-query-repository";
import {getAllBlogs} from "../repositories/query-repositories/blogs-query-repository";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req:Request, res:Response)=>{
    const queryValues = getQueryValues(req.query.pageNumber,req.query.pageSize,req.query.sortBy,req.query.sortDirection,req.query.searchTitleTerm)
    const blogs =  await getAllBlogs({...queryValues})
    if (!blogs || !blogs.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }
    res.status(CodeResponsesEnum.OK_200).send(blogs);
});

blogsRouter.get('/:id', validateBlogsRequests, validationPostsCreation, async (req:Request, res:Response)=>{
    debugger
   const blogID = req.params.id;
   const blogByID = await blogsService.findBlogByID(blogID);
   if(!blogID || !blogByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404);
   }
   res.status(CodeResponsesEnum.OK_200).send(blogByID);
});

blogsRouter.get('/:id/posts', async (req:Request, res:Response)=>{
     const blogID = req.params.id;
     const blogByID:OutputBlogType|null = await blogsService.findBlogByID(blogID);
     if(!blogID || !blogByID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
     }

    const queryValues = getQueryValues(req.query.pageNumber,req.query.pageSize,req.query.sortBy,req.query.sortDirection,req.query.searchTitleTerm)

    const posts = await findAllPostsByBlogID(blogID, {...queryValues});

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


