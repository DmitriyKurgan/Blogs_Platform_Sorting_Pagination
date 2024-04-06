import {Request, Response, Router} from "express";
import {
    validateAuthorization,
    validateErrorsMiddleware,
    validatePostsRequests, validationPostsCreation
} from "../middlewares/middlewares";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {posts, postsService} from "../services/posts-service";
import {OutputBlogType, OutputPostType} from "../utils/types";
import {blogsService} from "../services/blogs-service";
import {getAllPosts} from "../repositories/query-repositories/posts-query-repository";

export const postsRouter = Router({});

postsRouter.get('/', async (req:Request, res:Response)=>{
    const queryValues = getQueryValues(req.query.pageNumber,req.query.pageSize,req.query.sortBy,req.query.sortDirection,req.query.searchTitleTerm)
    const posts =  await getAllPosts({...queryValues})
    if (!posts || !posts.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }
    res.status(CodeResponsesEnum.OK_200).send(posts);
});

postsRouter.get('/:id', async (req:Request, res:Response)=>{
    const postID:string = req.params.id;
    const postByID:OutputPostType|null = await postsService.findPostByID(postID);
    if (!postID || !postByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
    res.status(CodeResponsesEnum.OK_200).send(postByID);
});

postsRouter.post('/', validateAuthorization, validatePostsRequests, validationPostsCreation, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const blog: OutputBlogType | null = await blogsService.findBlogByID(req.body.blogId)
    if (!blog){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const newPost: OutputPostType| null = await postsService.createPost( req.body, blog.name, blog.id);
    if (!newPost) {
        return
    }
    posts.push(newPost);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
});

postsRouter.put('/:id', validateAuthorization, validatePostsRequests, validationPostsCreation, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isUpdated = await postsService.updatePost(postID, req.body);

    if (!isUpdated || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const postByID = await postsService.findPostByID(postID);
    res.status(CodeResponsesEnum.Not_content_204).send(postByID);
});

postsRouter.delete('/:id', validateAuthorization, validatePostsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isDeleted = await postsService.deletePost(postID);
    if(!isDeleted || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});