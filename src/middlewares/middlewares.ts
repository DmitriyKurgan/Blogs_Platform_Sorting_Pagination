import { Request, Response, NextFunction } from 'express';
import {body, ValidationError, validationResult} from 'express-validator';
import {blogsService} from "../services/blogs-service";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const validateBlogsRequests = [
    body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Type of name must be string")
        .trim()
        .isLength({
            min: 1,
            max: 15,
        })
        .withMessage(
            "Name length must be more than 0 and less than or equal to 15 symbols"
        ),
    body("description")
        .exists()
        .withMessage("Description is required")
        .isString()
        .withMessage("Type of description must be string")
        .trim()
        .isLength({
            min: 1,
            max: 500,
        })
        .withMessage(
            "Description length must be more than 0 and less than or equal to 500 symbols"
        ),
    body("websiteUrl")
        .exists()
        .withMessage("Website URL is required")
        .isString()
        .withMessage("Type of Website URL must be string")
        .trim()
        .isLength({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Website URL length must be more than 0 and less than or equal to 100 symbols"
        )
        .matches(websiteUrlPattern)
        .withMessage("Website URL must be in correct format"),
];

export const validatePostsRequests = [
    body("title")
        .exists()
        .withMessage("Title is required")
        .isString()
        .withMessage("Type of title must be string")
        .trim()
        .isLength({
            min: 1,
            max: 30,
        })
        .withMessage(
            "Title length must be more than 0 and less than or equal to 30 symbols"
        ),
    body("shortDescription")
        .exists()
        .withMessage("Short description is required")
        .isString()
        .withMessage("Type of short description must be string")
        .trim()
        .isLength({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("content")
        .exists()
        .withMessage("Content is required")
        .isString()
        .withMessage("Type of content must be string")
        .trim()
        .isLength({
            min: 1,
            max: 1000,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 1000 symbols"
        ),
    body("blogId")
        .exists()
        .withMessage("Blog ID is required")
        .isString()
        .withMessage("Type of Blog ID must be string"),
];


export const validateAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    } else {
        next();
    }
};

export const validateErrorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorFormatter = ({ msg, param }: ValidationError) => {
        return {
            message: msg,
            field: param,
        };
    };

    const result = validationResult(req).formatWith(errorFormatter);
    const idFinder = result.array().find((e) => e.field === "id");
    const deviceIdFinder = result.array().find((e) => e.field === "deviceId");

    if (idFinder || deviceIdFinder) {
        res.status(404).json({ errorsMessages: result.array() });
        return;
    }

    if (!result.isEmpty()) {
        res
            .status(400)
            .json({ errorsMessages: result.array({ onlyFirstError: true }) });
    } else {
        next();
    }
};

export const validationPostsCreation = body("blogId").custom(async (value) => {
    const result = await blogsService.findBlogByID(value);
    if (!result) {
        throw new Error("Blog with provided ID not found");
    }
    return true;
});
