import { IUserRepository } from "../interface/repository/userRepository.interface";
import { IUserService } from "../interface/services/userService.interface";
import { AadhaarData } from "../interface/services/userService.types";


export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

 
getextractdata=async(getextractdata: any): Promise<AadhaarData> =>{
  try {
    const response = await this.userRepository.getextractdata(
      getextractdata
    );
    return response;
  } catch (error: any) {
    console.log("Error in addPost", error.message);
    throw new Error(error.message);
  }
}
  
}