import { Router } from "express";

import { AuthController } from "./controllers/authController";
import { UserController } from "./controllers/userController";
import { RoleController } from "./controllers/roleController";
import { PostController } from "./controllers/postController";

const authMiddleware = require("./middleware/authMiddleware");


const userController = new UserController();
const roleController = new RoleController();
const postController = new PostController();
const authController = new AuthController();


const router = Router();

router.post('/signup',authController.signUp);
router.post('/signin',authController.signIn);

// Create
router.post("/user", userController.create);

// Read
router.get("/users", userController.read_all);
router.get("/user/:email", userController.read_by_email);

// Update
router.put("/user/:email", userController.update_by_email);

// Delete
router.delete("/user/:email", userController.delete_by_email);

// Role routes

// Create
router.post("/role", roleController.create);

// Read
router.get("/roles", roleController.read_all);

// Update
router.put("/role/:role_name", roleController.update_by_name);

// Delete
router.delete("/role/:role_name", roleController.delete_by_name);

// Post routes

// Create
router.post("/post", postController.create);

// Read
router.get("/posts", postController.read_all);
router.get("/post/:id", postController.read_by_id);

// Update
router.put("/post/:id", postController.update_by_id);

// Delete
router.delete("/post/:id", postController.delete_by_id);


router.use(authMiddleware);

router.get('/', (req:any, res:any) => {
    res.json({"message":`Hello ${req.body.userRole}`});
})

export { router };

