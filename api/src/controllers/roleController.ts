import { Request, Response } from "express";
import { db } from "../db_conn";

interface IRoleReq{
    name: string;
}

class RoleController {

    async read_all (_req: Request, res: Response) {

        try{
            // Get roles
            const roles = await db.role.findMany();

            // Send response
            res.json(roles);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }

    }


    async create (req: Request, res: Response) {

        const { name }:IRoleReq = req.body;

        try{
            // Create a role
            const role = await db.role.create({
                data: {
                    name,
                }
            });

            // Send response
            res.json(role);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }

    }


    async update_by_name (req: Request, res: Response) {

        const { role_name } = req.params;
        const { name } = req.body;

        try{
            // update role
            const role = await db.role.update({
                where: { name: role_name, },
                data: { name }
            });

            // Send response
            res.json(role);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }

    }

    async delete_by_name (req: Request, res: Response) {

        const { role_name } = req.params;

        try{
            // Create a role
            const role = await db.role.delete({
                where: {
                    name: role_name,
                }
            });

            // Send response
            res.json(role);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }

    }


}

export { RoleController };
