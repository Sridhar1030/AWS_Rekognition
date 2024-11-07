import React, { useState } from "react";
import axios from "axios";
import { Cloud } from "lucide-react";

const Uploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            
        }
    };

    const uploadPhoto = async () => {
        if (!selectedFile) {
            setErrorMessage("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("files", selectedFile);

        try {
            setUploading(true);
            setErrorMessage("");
            setResponseMessage("");

            const response = await axios.post(
                "http://localhost:3000/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResponseMessage("File uploaded successfully!");
            console.log(response.data);

            const topLabels = response.data.results[0].labels.slice(0, 5);
            setLabels(topLabels);

            // Assuming the API returns the base64 file content
            setUploadedImage(`data:image/jpeg;base64,${response.data.results[0].fileContent}`);
        } catch (error: any) {
            console.error("Upload Error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred during upload."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="text-center">
                <Cloud className="mx-auto h-12 w-12 text-blue-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Upload Your Images</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Choose an image to upload and get AI-powered label suggestions
                </p>
            </div>

            <div className="mt-8">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                            accept="image/*"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>

                {/* Image Preview Section */}
                {uploadedImage && (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={uploadedImage}
                            alt="Preview"
                            className="max-w-full h-auto rounded-md border-2 border-gray-300"
                        />
                    </div>
                )}

                <button
                    onClick={uploadPhoto}
                    disabled={uploading || !selectedFile}
                    className={`mt-6 w-full py-3 px-4 rounded-md text-white font-medium
                        ${uploading || !selectedFile
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 transition-colors duration-200'
                        }`}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Upload Photo'
                    )}
                </button>

                {responseMessage && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-600">{responseMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                )}

                {labels.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Image Labels
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {labels.map((label, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full
                                        text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Uploader;
