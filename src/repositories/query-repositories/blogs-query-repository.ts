import {FilterQuery, Model, Document} from 'mongoose';
import {BLogType, OutputBlogType, OutputPostType, Paginator, PostType} from "../../utils/types";
import {ObjectId, Filter, WithId} from "mongodb";


export const BLogMapper = (blog : WithId<BLogType>) : OutputBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export async function findBlogById(Blog: Model<Document>, _id: string): Promise<Document | null> {
    const foundBlog = await Blog.findOne({ _id });

    return foundBlog;
}