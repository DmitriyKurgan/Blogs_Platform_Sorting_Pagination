import {Request, Response, Router} from "express";
import {blogs, blogsRepository} from "../repositories/blogs-repository";
import {CodeResponsesEnum} from "../utils/utils";
import {OutputBlogType} from "../utils/types";
import {validateAuthorization, validateBlogsRequests, validateErrorsMiddleware} from "../middlewares/middlewares";
export const blogsRouter = Router({});

blogsRouter.get('/', (req:Request, res:Response)=>{
    res.send(blogs).status(CodeResponsesEnum.OK_200);
});

blogsRouter.get('/:id', async (req:Request, res:Response)=>{
   const blogID = req.params.id;
   const blogByID = await blogsRepository.findBlogByID(blogID);
   if(!blogID || !blogByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404);
   }
   res.status(CodeResponsesEnum.OK_200).send(blogByID);
});

blogsRouter.get('/:id/posts', async (req:Request, res:Response)=>{
    debugger
    console.log('BLOG_POSTS: ', {req, res})
    // const blogID = req.params.id;
    // const blogByID = await blogsRepository.findBlogByID(blogID);
    // if(!blogID || !blogByID){
    //     return res.sendStatus(CodeResponsesEnum.Not_found_404);
    // }
    // res.status(CodeResponsesEnum.OK_200).send(blogByID);
});

blogsRouter.post('/', validateAuthorization, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const newBlog: OutputBlogType|null = await blogsRepository.createBlog(req.body);
    if (newBlog){
        blogs.push(newBlog);
        res.status(CodeResponsesEnum.Created_201).send(newBlog);
    }
});

blogsRouter.put('/:id', validateAuthorization, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const blogID = req.params.id;
    const isUpdated:boolean = await blogsRepository.updateBlog(blogID, req.body);
    if (!isUpdated || !blogID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);

    }
    const blog = await blogsRepository.findBlogByID(blogID);
    res.status(CodeResponsesEnum.Not_content_204).send(blog);
});

blogsRouter.delete('/:id', validateAuthorization, validateErrorsMiddleware,async (req:Request, res:Response)=>{
    const blogID:string = req.params.id;
    const isDeleted:boolean = await blogsRepository.deleteBlog(blogID);
    if (!isDeleted || !blogID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


