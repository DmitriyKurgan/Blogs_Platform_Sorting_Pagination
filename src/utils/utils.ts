
import {PostMapper} from "../repositories/query-repositories/posts-query-repository";
import {BLogMapper} from "../repositories/query-repositories/blogs-query-repository";
import {BLogType, PostType} from "./types";
import {WithId} from "mongodb";
import {blogsCollection, postsCollection} from "../repositories/db";

export enum CodeResponsesEnum {
    Incorrect_values_400 = 400,
    Not_found_404 = 404,
    Not_content_204 = 204,
    Created_201 = 201,
    OK_200 = 200,
}

export const getQueryValues = (pageNumber?:any,pageSize?:any,sortBy?:any,sortDirection?:any,searchNameTerm?:any)=>{
    return {
        pageNumber: pageNumber ? parseInt(pageNumber as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
        sortBy: sortBy ? sortBy as string : "createdAt",
        sortDirection: sortDirection ? sortDirection as "asc" | "desc" : "desc",
        searchNameTerm: searchNameTerm ? searchNameTerm as string : undefined,
    }
}

export const getPostsFromBD = async (query:any, blogID?:string) => {
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
            items: items.map((post:WithId<PostType>) => PostMapper(post)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}

export const getBlogsFromBD = async (query:any) => {
    const search = query.searchNameTerm
        ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...search,
    };

    try {
        const items = await blogsCollection
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map((blog:WithId<BLogType>) => BLogMapper(blog)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}