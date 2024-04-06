import {FilterQuery, Model, Document} from 'mongoose';
import {Paginator, PostType} from "../../utils/types";
import {ObjectId,Filter} from "mongodb";
import {query} from "express-validator";
import {postsCollection} from "../posts-repository";


export async function findAllPostsByBlogID(blogID: string, query: any): Promise<any | { error: string }> {
    const byId = blogID ? { blogId: new ObjectId(blogID) } : {};
    const search = query.searchNameTerm
        ? { title: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...byId,
        ...search,
    };

    try {
        const items = await postsCollection
            .find(filter as Filter<PostType>)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter as Filter<PostType>);

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items,
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