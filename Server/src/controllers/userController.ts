import { IUserController } from "../interface/controller/userController.interface";
import { ControllerResponse } from "../interface/controller/userController.types";

import Tesseract from "tesseract.js";


export class UserController implements IUserController {
  

  
  
  

  getextractdata = async (httpRequest:any): Promise<ControllerResponse> => {
    try {
      console.log("Request received:", httpRequest);

      if (!httpRequest.files || httpRequest.files.length < 2) {
        throw new Error("Two images (front and back) are required.");
      }

      const [frontImage, backImage] = httpRequest.files;
      console.log("Front Image Path:", frontImage.path);
      console.log("Back Image Path:", backImage.path);

    
      const frontText = await this.extractText(frontImage.path);
      const backText = await this.extractText(backImage.path);

      console.log("Front Image Text:", frontText);
      console.log("Back Image Text:", backText);

      
      const extractedData = this.parseAadhaarData(frontText, backText);
      
      console.log('sasi',extractedData)
      

      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 201,
        body:extractedData,
      };
    } catch (error: any) {
      console.error("Error in getextractdata:", error.message);
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 500,
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  };

  private async extractText(imagePath: string): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(imagePath, "eng");
      return data.text;
    } catch (err) {
      console.error("Error extracting text from image:", err);
      return "Error extracting text";
    }
  }

  private parseAadhaarData(frontText: string, backText: string) {
    const aadhaarRegex = /\b(\d{4}\s\d{4}\s\d{4})\b/;
    const dobRegex = /DOB[:\s]+(\d{2}\/\d{2}\/\d{4})/;
    const genderRegex = /\b(MALE|FEMALE|OTHER)\b/i;
    const nameRegex = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/m;
    const pincodeRegex = /\b\d{6}\b/;
  
    let aadhaarNumber = frontText.match(aadhaarRegex)?.[1] || backText.match(aadhaarRegex)?.[1] || "Not found";
    const dob = frontText.match(dobRegex)?.[1] || "Not found";
    const gender = frontText.match(genderRegex)?.[1] || "Not found";
    const name = frontText.match(nameRegex)?.[0] || "Not found";
  
  
    const lines = backText.split("\n").map(line => line.trim()).filter(line => line);
    let address = "Not found";
    let structuredAddress: any = {};
  
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes("address")) {
        address = lines.slice(i + 1).join(" ");
        break;
      }
    }
  
    
    const addressParts = address.split(",");
    structuredAddress = {
      doorNo: addressParts[1]?.trim() || "Not found",
      street: addressParts[2]?.trim()
        .replace(/EE ed RS S/g, "")  
        .replace(/\s+/g, " ")        
        .trim() || "Not found",
      village: addressParts[3]?.trim() || "Not found",
      taluk: addressParts[4]?.trim() || "Not found",
      block: addressParts[5]?.trim() || "Not found",
      postOffice: addressParts[6]?.trim() || "Not found",
     district: addressParts[7]?.replace(/DIST:\s*/i, "").trim() || "Not found",
      state: addressParts[8]?.trim() || "Not found",
      pincode: backText.match(pincodeRegex)?.[0] || "Not found"
    };
    const missingFields = [
      aadhaarNumber, dob, gender, name, structuredAddress.doorNo, 
      structuredAddress.street, structuredAddress.village, structuredAddress.pincode
  ].filter(value => value === "Not found").length;

  
  if (missingFields > 2) {
    throw new Error("Upload a valid Aadhaar image");
}

    return { aadhaarNumber, dob, gender, name, address: structuredAddress };
  }
  
}
