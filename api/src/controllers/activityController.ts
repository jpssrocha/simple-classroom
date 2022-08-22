import { Request, Response } from "express";
import { db } from "../db_conn";

interface IActivityReq {
    value: number;
    title: string;
    description: string;
    due_date: string;
}

class ActivityController {

    async create (req: Request, res: Response){
        /* 
         * Create a activity with JSON body containing the value, title and
         * description.
        */
        try{
            const { value, title, description, due_date }:IActivityReq = req.body;

            const activity = await db.activity.create({
                data: {
                    value,
                    title,
                    description,
                    due_date,
                },
                include: {attachments: true}
            });

            res.json(activity);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_all (_req: Request, res: Response){
        /* Read all activities */

        try{
            const activities = await db.activity.findMany({
                include: { attachments: true }
            });
            res.json(activities);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_by_id (req: Request, res: Response){
        /* Read activity by id using path variable */
        try{

            const { id } = req.params;

            const activity = await db.activity.findUnique({
                where: { id },
                include: { 
                    attachments: true
                },
            });

            res.json(activity);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async update_by_id (req: Request, res: Response){
        /* Update activity by id using path variable */
        try{
            const { id } = req.params;

            const { value, title, description, due_date }:IActivityReq = req.body;

            const updated_entry: {[key: string]: any} = { value, title, description, due_date };

            // Clean up to make requisition flexible
            let final_entry: {[key: string]: any} = {};

            for (let key in updated_entry) {
                if (updated_entry[key]){
                    final_entry[key] = updated_entry[key];
                }
            }

            const activity = await db.activity.update({
                where: { id },
                data: final_entry
            });

            res.json(activity)
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async delete_by_id (req: Request, res: Response){
        /* Delete activity by id using path variable */
        try{
        const { id } = req.params;

        const activity = await db.activity.delete({
            where: { id }
        });

        res.json(activity);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }  

}

export { ActivityController };
