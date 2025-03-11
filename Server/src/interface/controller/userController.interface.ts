import { Request } from "express";
import { ControllerResponse } from "./userController.types";

export interface IUserController {
 
    getextractdata(httpRequest:Request):Promise<ControllerResponse>
}