export enum CodeResponsesEnum {
    Incorrect_values_400 = 400,
    Not_found_404 = 404,
    Not_content_204 = 204,
    Created_201 = 201,
    OK_200 = 200,
}

export const getQueryValues = (pageNumber?:any,pageSize?:any,sortBy?:any,sortDirection?:any,searchTitleTerm?:any)=>{
    return {
        pageNumber: pageNumber ? parseInt(pageNumber as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
        sortBy: sortBy ? sortBy as string : "createdAt",
        sortDirection: sortDirection ? sortDirection as "asc" | "desc" : "desc",
        searchNameTerm: searchTitleTerm ? searchTitleTerm as string : undefined,
    }
}