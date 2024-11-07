import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download } from "lucide-react";

interface Image {
    primary_key: string;
    name: string;
    labels: string[];
    fileContent: string; // Change this to store the base64 content
}

const ImageGallery: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000");
                setImages(response?.data?.results || []);
                console.log("images is ",response.data.results)
                setError("");
            } catch (error) {
                console.error("Error fetching images:", error);
                setError("Failed to load images. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleDownload = (fileContent: string, name: string) => {
        const link = document.createElement("a");
        link.href = `data:image/jpeg;base64,${fileContent}`; // Assuming it's an image
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg">No images uploaded yet.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
                <div
                    key={image.primary_key}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="relative aspect-w-3 aspect-h-2">
                        <img
                            src={`data:image/jpeg;base64,${image.fileContent}`} // Use base64 content as image source
                            alt={image.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {image.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-1">
                            {image.labels.slice(0, 3).map((label, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 
                                        text-gray-800 rounded-full"
                                >
                                    {label}
                                </span>
                            ))}
                            {image.labels.length > 3 && (
                                <span className="inline-block px-2 py-1 text-xs font-medium 
                                    bg-gray-100 text-gray-600 rounded-full">
                                    +{image.labels.length - 3}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => handleDownload(image.fileContent, image.name)} // Pass fileContent for download
                            className="mt-4 w-full flex items-center justify-center px-4 py-2 
                                border border-transparent text-sm font-medium rounded-md 
                                text-white bg-blue-600 hover:bg-blue-700 transition-colors 
                                duration-200"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
