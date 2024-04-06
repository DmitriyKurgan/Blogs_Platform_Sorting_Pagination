import {client} from "../repositories/db";
import {InsertOneResult, ObjectId, WithId, UpdateResult, DeleteResult} from "mongodb";
import {BLogType, OutputBlogType, PostType} from "../utils/types";
import {BLogMapper} from "./query-repositories/blogs-query-repository";
export const blogs = [] as BLogType[]


export const blogsCollection =  client.db('learning').collection<BLogType>('blogs')
export const blogsRepository = {

   async findBlogByID(blogID:string):Promise<OutputBlogType | null> {
       const blog: WithId<BLogType> | null = await blogsCollection.findOne({_id: new ObjectId(blogID)});
       return blog ? BLogMapper(blog) : null
    },
    async createBlog(newBlog:BLogType):Promise<OutputBlogType | null> {
        const result:InsertOneResult<BLogType> = await blogsCollection.insertOne(newBlog);
        const blog = await blogsCollection.findOne({_id: result.insertedId});
        return blog ? BLogMapper(blog) : null;
    },
    async updateBlog(blogID:string, body:BLogType):Promise<boolean> {

        const result: UpdateResult<BLogType>= await blogsCollection.updateOne({_id: new ObjectId(blogID)},
            {$set:{name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
            }}
        );

        return result.matchedCount === 1;
    },
   async deleteBlog(blogID:string): Promise<boolean>{
        const result: DeleteResult = await blogsCollection.deleteOne({_id:new ObjectId(blogID)});
        return result.deletedCount === 1
    }

}