import { IUserRepository } from "../interface/repository/userRepository.interface";
import { AadhaarData } from "../interface/repository/userRepository.types";

export class UserRepository implements IUserRepository {
getextractdata=async(extractData: any): Promise<any>=> {
    

     
try {
     console.log(extractData)
      
    } catch (error: any) {
      console.error("Error in getComment:", error);
      throw new Error(error.message);
    }
 
  
  }

}