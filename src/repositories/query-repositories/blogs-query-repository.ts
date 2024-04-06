import {FilterQuery, Model, Document} from 'mongoose';
import {BLogType, OutputBlogType, OutputPostType, Paginator, PostType} from "../../utils/types";
import {ObjectId, Filter, WithId} from "mongodb";
import {postsCollection} from "../posts-repository";
import {PostMapper} from "./posts-query-repository";
import {getItemsFromBD} from "../../utils/utils";


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

export async function getAllBlogs(query: any): Promise<any | { error: string }> {
    return getItemsFromBD(query);
}