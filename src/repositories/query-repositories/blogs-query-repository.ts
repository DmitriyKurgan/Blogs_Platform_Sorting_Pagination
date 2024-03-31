import {FilterQuery, Model, Document} from 'mongoose';
import {Paginator} from "../../utils/types";


export async function findAllPostsByBlogId(
    Post: Model<Document>,
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string = "createdAt",
    sortDirection: "asc" | "desc" = "desc",
    searchTitleTerm?: string
): Promise<Paginator<Document[]>> {
    const filter: FilterQuery<Document> = { blogId };

    if (searchTitleTerm) {
        filter['title'] = { $regex: searchTitleTerm, $options: "i" };
    }

    const posts = await Post.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize > 0 ? pageSize : 0)
        .lean();

    const totalCount = await Post.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount,
        items: posts,
    };
}

export async function findPostById(Post: Model<Document>, _id: string): Promise<Document | null> {
    const foundPost = await Post.findOne({ _id });

    return foundPost;
}