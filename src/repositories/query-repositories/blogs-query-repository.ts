import {BLogType, OutputBlogType} from "../../utils/types";
import {WithId} from "mongodb";
import {getBlogsFromBD} from "../../utils/utils";

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
    return getBlogsFromBD(query);
}