import { Request, Response } from "express";
import { db } from "../db_conn";

interface IAttachmentReq {
    relative_path: string;
    filename: string;
    post_id?: string;
    activity_id?: string;
}

class AttachmentController {

    async create (req: Request, res: Response){
        /* 
         * Create a attachment with JSON body containing the relative_path,
         * filename, and description. Optionally the post_id or activity_id.
        */
        try{
            const { relative_path, filename, post_id, activity_id }:IAttachmentReq = req.body;

            const attachment = await db.attachment.create({
                data: {
                    relative_path,
                    filename,
                    post_id,
                    activity_id,
                },
                include: {
                    post: true,
                    activity: true
                }
            });

            res.json(attachment);
        }

        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_all (_req: Request, res: Response){
        /* Read all attachments */

        try{
            const attachments = await db.attachment.findMany({
                include: { 
                    post: true,
                    activity: true
                }
            });
            res.json(attachments);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_by_id (req: Request, res: Response){
        /* Read attachment by id using path variable */
        try{

            const { id } = req.params;

            const attachment = await db.attachment.findUnique({
                where: { id },
                include: { 
                    post: true,
                    activity: true
                },
            });

            res.json(attachment);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async update_by_id (req: Request, res: Response){
        /* Update attachment by id using path variable */
        try{
            const { id } = req.params;

            const { relative_path, filename, post_id, activity_id }:IAttachmentReq = req.body;

            const updated_entry: {[key: string]: any} = { relative_path, filename, post_id, activity_id };

            // Clean up to make requisition flexible
            let final_entry: {[key: string]: any} = {};

            for (let key in updated_entry) {
                if (updated_entry[key]){
                    final_entry[key] = updated_entry[key];
                }
            }

            const attachment = await db.attachment.update({
                where: { id },
                data: final_entry
            });

            res.json(attachment)
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async delete_by_id (req: Request, res: Response){
        /* Delete attachment by id using path variable */
        try{
        const { id } = req.params;

        const attachment = await db.attachment.delete({
            where: { id }
        });

        res.json(attachment);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }  

}

export { AttachmentController };
