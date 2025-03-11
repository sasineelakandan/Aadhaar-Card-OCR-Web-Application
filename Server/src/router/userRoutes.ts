import { Router} from "express";
import { expressCallback } from "../utils/expressCallback";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import upload from "../utils/multer";
const router = Router();

const repository = new UserRepository();

const service = new UserService(repository);

const controller = new UserController(service);

router.
route('/extractData').post(upload.array('files', 2),expressCallback(controller.getextractdata))

export default router;