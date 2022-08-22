import { Request, Response } from "express";
import jwt from "jsonwebtoken";

module.exports = (req: Request, res: Response, next: any) => {

    // take token
    const token = req.headers.authorization;

    // check if it was really provided
    if (!token) {
        return res.status(401).send(
                {error: "No token provided"}
        );
    }

    // check if the token is valid
    
    jwt.verify(token, String(process.env.JWT_SECRET), (err: any, decoded: any) => {
        
        if (err) {
            return res.status(401).send({error: "Token not valid", err});

        }

        req.body.userId = decoded.id;
        req.body.userRole = decoded.role;

        return next();

    });
};
