import { useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Address {
  doorNo?: string;
  street?: string;
  village?: string;
  taluk?: string;
  district?: string;
  state?: string;
  pincode?: string;
  postOffice?: string;
  block?: string;
}

interface ExtractedData {
  name?: string;
  gender?: string;
  dob?: string;
  aadhaarNumber?: string;
  address?: Address;
}

function App() {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
 
const [extractedData, setExtractedData] = useState<ExtractedData>({})
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isFront: boolean) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedFormats.includes(file.type)) {
      toast.error("Only JPEG, JPG, and PNG images are allowed.");
      return;
    }

    if (isFront) setFrontImage(file);
    else setBackImage(file);
  };

  const processOCR = async () => {
    setError(null);
    if (!frontImage || !backImage) {
      toast.error("Both Front and Back Aadhaar images are required.");
      return;
    }

    setLoading(true);
    setExtractedData({});

    try {
      const formData = new FormData();
    formData.append("files", frontImage);
    formData.append("files", backImage)

      const response = await axios.post("http://localhost:8001/api/user/extractData", formData);
     if(response.data){
      toast.success('Success fully extracted')
      setExtractedData(response.data)
     }
     
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
        console.log(errorMessage);
        toast.error(errorMessage || "An error occurred during sign-up.");
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Aadhaar OCR Scanner</h1>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 w-full max-w-3xl text-center">
          {error}
        </div>
      )}

      <div className="upload-container">
        <div className="flex flex-col items-center">
          {frontImage && <img src={URL.createObjectURL(frontImage)} alt="Front" className="h-40 rounded-md mb-4" />}
          <input type="file" id="front-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, true)} />
          <label htmlFor="front-upload" className="bg-white text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer">
            Upload Front Side
          </label>
        </div>
      </div>

      <div className="upload-container">
        <div className="flex flex-col items-center">
          {backImage && <img src={URL.createObjectURL(backImage)} alt="Back" className="h-40 rounded-md mb-4" />}
          <input type="file" id="back-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, false)} />
          <label htmlFor="back-upload" className="bg-white text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer">
            Upload Back Side
          </label>
        </div>
      </div>

      <button
        onClick={processOCR}
        className="mt-6 bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading || !frontImage || !backImage}
      >
        {loading ? "Processing..." : "Extract Aadhaar Data"}
      </button>

      {Object.keys(extractedData).length > 0 && !error && (
  <div className="mt-6 bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Extracted Aadhaar Details</h2>
    <p><strong>Name:</strong> {extractedData.name}</p>
    <p><strong>Athaar No:</strong>{extractedData.aadhaarNumber}</p>
    <p><strong>Gender:</strong> {extractedData.gender}</p>
    <p><strong>Date of Birth:</strong> {extractedData.dob}</p>

    {extractedData.address && (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Address:</h3>
        <p><strong>Door No:</strong> {extractedData.address.doorNo}</p>
        <p><strong>Street:</strong> {extractedData.address.street}</p>
        <p><strong>Village:</strong> {extractedData.address.village}</p>
        <p><strong>Taluk:</strong> {extractedData.address.taluk}</p>
        <p><strong>District:</strong> {extractedData.address.district}</p>
       
        <p><strong>Pincode:</strong> {extractedData.address.pincode}</p>
      </div>
    )}
  </div>
)}
 <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
