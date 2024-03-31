import {Model, Document} from 'mongoose';

export async function findBlogById(Blog: Model<Document>, _id: string): Promise<Document | null> {
    const foundBlog = await Blog.findOne({ _id });

    return foundBlog;
}