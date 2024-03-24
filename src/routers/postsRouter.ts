import {Request, Response, Router} from "express";
import {
    validateAuthorization,
    validateErrorsMiddleware,
    validatePostsRequests, validationPostsCreation
} from "../middlewares/middlewares";
import {CodeResponsesEnum} from "../utils/utils";
import {posts, postsRepository} from "../repositories/posts-repository";
import {OutputBlogType, OutputPostType} from "../utils/types";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsRouter = Router({});

postsRouter.get('/', (req:Request, res:Response)=>{
    res.send(posts).status(CodeResponsesEnum.OK_200);
});

postsRouter.get('/:id', async (req:Request, res:Response)=>{
    const postID:string = req.params.id;
    const postByID:OutputPostType|null = await postsRepository.findPostByID(postID);
    if (!postID || !postByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
    res.status(CodeResponsesEnum.OK_200).send(postByID);
});

postsRouter.post('/', validateAuthorization, validatePostsRequests, validationPostsCreation, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const blog: OutputBlogType | null = await blogsRepository.findBlogByID(req.body.blogId)
    if (!blog){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const newPost: OutputPostType| null = await postsRepository.createPost(req.body, blog.name);
    if (!newPost) {
        return
    }
    posts.push(newPost);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
});

postsRouter.put('/:id', validateAuthorization, validatePostsRequests, validationPostsCreation, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isUpdated = await postsRepository.updatePost(postID, req.body);

    if (!isUpdated || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const postByID = await postsRepository.findPostByID(postID);
    res.status(CodeResponsesEnum.Not_content_204).send(postByID);
});

postsRouter.delete('/:id', validateAuthorization, validatePostsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isDeleted = await postsRepository.deletePost(postID);
    if(!isDeleted || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});