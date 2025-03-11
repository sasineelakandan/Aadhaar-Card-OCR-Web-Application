import { IUserController } from "../interface/controller/userController.interface";
import { ControllerResponse } from "../interface/controller/userController.types";
import { IUserService } from "../interface/services/userService.interface";
import Tesseract from "tesseract.js";
import fs from "fs";

export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  getextractdata = async (httpRequest: any): Promise<ControllerResponse> => {
    try {
      console.log("Request received:", httpRequest);

      if (!httpRequest.files || httpRequest.files.length < 2) {
        throw new Error("Two images (front and back) are required.");
      }

      const frontImagePath = httpRequest.files[0].path;
      const backImagePath = httpRequest.files[1].path;

      console.log("Front Image Path:", frontImagePath);
      console.log("Back Image Path:", backImagePath);

      // Extract text using Tesseract.js OCR
      const frontText = await Tesseract.recognize(frontImagePath, "eng")
        .then(({ data }) => data.text)
        .catch((err) => {
          console.error("Error processing front image:", err);
          return "Error extracting text";
        });

      const backText = await Tesseract.recognize(backImagePath, "eng")
        .then(({ data }) => data.text)
        .catch((err) => {
          console.error("Error processing back image:", err);
          return "Error extracting text";
        });

      console.log("Front Image Text:", frontText);
      console.log("Back Image Text:", backText);

      // Store extracted text in the database (if required)
      const extractedData = { frontText, backText };
      const savedData = await this.userService.getextractdata(extractedData);

      // Remove temporary uploaded files
      fs.unlinkSync(frontImagePath);
      fs.unlinkSync(backImagePath);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: savedData,
      };
    } catch (error: any) {
      console.error("Error in getextractdata:", error.message);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500,
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  };
}
