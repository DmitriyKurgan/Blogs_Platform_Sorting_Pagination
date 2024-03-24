import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
export const testingRouter = Router({})

testingRouter.delete('/', (req:Request, res: Response) => {
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})

