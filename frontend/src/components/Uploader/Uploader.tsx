import React, { useState } from "react";
import axios from "axios";


const Uploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [labels, setLabels] = useState<any[]>([]); // to store the top 5 labels and categories

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
            
            // Extract top 5 labels and categories
            const topLabels = response.data.results[0].labels.slice(0, 5);
            setLabels(topLabels);

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
        <div className="flex flex-col items-center p-5 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Photo Uploader</h2>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-4 border border-gray-300 rounded p-2"
            />
            <button
                onClick={uploadPhoto}
                disabled={uploading}
                className={`w-full py-2 mb-4 text-white font-semibold rounded ${
                    uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {uploading ? "Uploading..." : "Upload Photo"}
            </button>
            {responseMessage && (
                <p className="text-green-600 mt-2">{responseMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-600 mt-2">{errorMessage}</p>
            )}

            {/* Display top 5 labels and categories */}
            {labels.length > 0 && (
                <div className="mt-4 w-full">
                    <h3 className="text-xl font-semibold">Top 5 Labels:</h3>
                    <ul className="list-disc pl-5">
                        {labels.map((label, index) => (
                            <li key={index} className="text-lg">
                                <strong>{label}</strong> 

                            </li>
                        ))}
                    </ul>
                </div>
            )}
            this is image list
        </div>
    );
};

export default Uploader;
