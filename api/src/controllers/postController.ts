import { Request, Response } from "express";
import { db } from "../db_conn";

class PostController {

    async create (req: Request, res: Response){
        /* 
         * Create a post with JSON body containing the User id (authorId) and 
         * desired text (text).
        */
        try{

            const { authorId, text } = req.body;

            const post = await db.post.create({
                data: {
                    authorId,
                    text,
                },
                include: {author: true}
            });

            res.json(post);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_all (_req: Request, res: Response){
        /* Read all posts */

        try{
            const posts = await db.post.findMany({ include: { author: true } });
            res.json(posts);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async read_by_id (req: Request, res: Response){
        /* Read post by id using path variable */
        try{
            const { id } = req.params;

            const post = await db.post.findUnique({
                where: { id },
                include: { 
                    author: true
                },
            });

            res.json(post);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async update_by_id (req: Request, res: Response){
        /* Update post by id using path variable */
        try{
            const { id } = req.params;

            const { authorId, text } = req.body;

            const updated_entry: {[key: string]: any} = { authorId, text };

            // Clean up to make requisition flexible
            let final_entry: {[key: string]: any} = {};

            for (let key in updated_entry) {
                if (updated_entry[key]){
                    final_entry[key] = updated_entry[key];
                }
            }

            const post = await db.post.update({
                where: { id },
                data: final_entry
            });

            res.json(post)
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }

    async delete_by_id (req: Request, res: Response){
        /* Delete post by id using path variable */
        try{
            const { id } = req.params;

            const post = await db.post.delete({
                where: { id }
            });

            res.json(post);
        }
        catch(error){
            if (error instanceof Error){
                res.status(422).json({ error: error.message });
            }
        }
    }  


}

export { PostController };
