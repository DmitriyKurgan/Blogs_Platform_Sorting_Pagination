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