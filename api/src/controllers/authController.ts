import { Request, Response } from "express";
import { db } from "../db_conn";

import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUserRegister {
    name: string;
    email: string;
    role: string
    password: string;
    confirmedPassword: string;
}

class AuthController {

    async signUp (req: Request, res: Response) {

        const { name, email, role, password, confirmedPassword } = req.body as IUserRegister;

        // Check if the password confirmation was correct
        if (password != confirmedPassword) {

            return res.status(400).json({
                error: "Password do not match."
            });
        }

        // Checking if user exist
        const user = await db.user.findFirst({where: {email}});

        if (user) {
            return res.status(400).json({
                error: "Email already used."
            })
        }

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 10),
                role
            }
        });

        return res.status(201).json({ 
            message: "User created successfully",
            user: { ...newUser, password: undefined }
        });
    }

    async signIn (req: Request, res: Response) {

        const { email, password } = req.body;

        const user = await db.user.findFirst({ where: {email} });

        if (!user) {
            return res.status(404).json({
                error: "User does not exist"
            });
        }

        const passIsValid = await bcrypt.compare(password, user.password)

        if (!passIsValid) {
            return res.status(404).json({
                error: "Email or password is incorrect"
            });
        }

        const token = jwt.sign({id: user.id, role: user.role} , String(process.env.JWT_SECRET), {"expiresIn": "24h"})

        return res.status(200).json({
            message: "Logged in successfully",
            user: { ...user, password: undefined, token },
        });


    }

}

export { AuthController };
