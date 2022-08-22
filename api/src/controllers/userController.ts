import { Request, Response } from "express";
import { db } from "../db_conn";

interface IUserReq{
    name: string;
    email: string;
    password: string;
    role_name: string;
}

class UserController {

    async create(req: Request, res: Response) {
        /* Create a user on the database */

        try{

            const { name, password, email, role_name }: IUserReq = req.body;


            const user = await db.user.create({
                data: {
                    name,
                    password,
                    email,
                    role: role_name
                }
            });

            // Send response
            res.json(user);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }

    }

    async read_all(_req: Request, res: Response) {
        /* See all user stored on the database */

        try{
            // Get users
            const users = await db.user.findMany();

            // Send response
            res.json(users);
       }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }


    async read_by_email(req: Request, res: Response) {
        /* Get user by email */


        const { email } = req.params;


        try{
            // Get users
            const user = await db.user.findUnique({
                where: { email }

            });

            // Send response
            res.json(user);
       }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

     async update_by_email (req: Request, res: Response){
         /* Update user by email */

        // Get info from requisition
        const { user_email } = req.params;

        const { name, password, email, role_name }: IUserReq = req.body;

        // Setup objects to input to the database
        const updated_entry: {[key: string]: any} = { name, password, email, role: role_name };

        // Clean up to make requisition flexible
        let final_entry: {[key: string]: any} = {};

        for (let key in updated_entry) {
            if (updated_entry[key]){
                final_entry[key] = updated_entry[key];
            }
        }


        try{
            // Update user

            const user_info = await db.user.findFirst({
                where: { email: user_email},
                select: { id: true }
            });

            if ( user_info ){
             const user = await db.user.update({
                 where: { id: user_info.id },
                 data: final_entry,
             });

             // Send response
             res.json(user);
            }

       }

        catch(error){
            if (error instanceof Error){
                console.error(error.message);
                res.status(422).json({ error: error.message });
            }
        }

    }

    async delete_by_email (req: Request, res: Response) {

        // Get info from requisition
        const { user_email } = req.params;

        try{
            // DELETE user

            // Get user id - Prisma's delete only work with id fields
            const user_info = await db.user.findFirst({
                where: { email: user_email},
                select: { id: true }
            });

            if ( user_info ){
             const user = await db.user.delete({
                 where: { id: user_info.id },
             });

             // Send response
             res.json(user);
            }
        }
        catch(error){
            if (error instanceof Error){
                console.error(error.message);
                res.status(422).json({ error: error.message });
            }
        }

    }

}

export { UserController };
