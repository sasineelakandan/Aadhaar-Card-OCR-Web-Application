import {AadhaarData} from "./userRepository.types";




export interface IUserRepository {
    
    getextractdata(extractData:any):Promise<AadhaarData>
   
 }