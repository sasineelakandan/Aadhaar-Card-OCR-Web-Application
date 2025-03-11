import {AadhaarData} from "./userService.types";

export interface IUserService {

    getextractdata(getextractdata:any):Promise<AadhaarData>
}