export type BLogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date | string
    isMembership:boolean
}

export type OutputBlogType = BLogType & {id:string}

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName:string
    createdAt: Date | string
}

export type OutputPostType = PostType & {id:string}

export type BlogsServiceType = {
    findBlogByID(blogID: string): Promise<OutputBlogType | null>
    createBlog(body: BLogType): Promise<OutputBlogType | null>
    updateBlog(blogID: string, body: BLogType): Promise<boolean>
    deleteBlog(blogID: string): Promise<boolean>
}

export type PostsServiceType = {
    findPostByID(postID: string): Promise<OutputPostType | null>
    createPost(body: PostType, blogName: string, blogID: string):Promise<OutputPostType | null>
    updatePost(postID: string, body: PostType): Promise<boolean>
    deletePost(postID: string): Promise<boolean>
}

export type Paginator<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T;
}