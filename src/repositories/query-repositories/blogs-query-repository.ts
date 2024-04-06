import {FilterQuery, Model, Document} from 'mongoose';
import {OutputPostType, Paginator, PostType} from "../../utils/types";
import {ObjectId, Filter, WithId} from "mongodb";
import {query} from "express-validator";
import {postsCollection} from "../posts-repository";
const PostMapper = (post : WithId<PostType>) : OutputPostType => {
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


export async function findAllPostsByBlogID(blogID: string, query: any): Promise<any | { error: string }> {
    const byId = blogID ? {  blogId: blogID } : {};
    const search = query.searchNameTerm
        ? { title: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...byId,
        ...search,
    };

    try {
        const items = await postsCollection
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map(post => PostMapper(post)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}


export async function findPostById(Post: Model<Document>, _id: string): Promise<Document | null> {
    const foundPost = await Post.findOne({ _id });

    return foundPost;
}