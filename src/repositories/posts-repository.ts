import {client} from "./db";
import {ObjectId, WithId, InsertOneResult, UpdateResult, DeleteResult} from "mongodb";
import {OutputPostType, PostType} from "../utils/types";
export const posts = [] as PostType[]

export const PostMapper = (post : WithId<PostType>) : OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

const postsCollection =  client.db('learning').collection<PostType>('blogs')
export const postsRepository = {
    async findPostByID(postID:string):Promise<OutputPostType | null> {
        const post: WithId<PostType> | null = await postsCollection.findOne({_id: new ObjectId(postID)});
        return post ? PostMapper(post) : null
    },
   async createPost(body:PostType, blogName:string):Promise<OutputPostType | null> {
        const newPost:PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName,
            createdAt: new Date().toISOString()
        }

       const result:InsertOneResult<PostType> = await postsCollection.insertOne(newPost)
       const post = await postsCollection.findOne({_id:result.insertedId})
       return post ? PostMapper(post) : null

    },
   async updatePost(postID:string, body:PostType): Promise<boolean> {
        const result: UpdateResult<PostType> = await postsCollection.updateOne({_id: new ObjectId(postID)},
            {$set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                }});
       return result.matchedCount === 1
    },
   async deletePost(postID:string){

        const result: DeleteResult = await postsCollection.deleteOne({_id: new ObjectId(postID)})

       return result.deletedCount === 1
    }

}