import { Router} from "express";
import { expressCallback } from "../utils/expressCallback";
import { UserController } from "../controllers/userController";

import upload from "../utils/multer";
const router = Router();



const controller = new UserController();

router.
route('/extractData').post(upload.array('files', 2),expressCallback(controller.getextractdata))

export default router;