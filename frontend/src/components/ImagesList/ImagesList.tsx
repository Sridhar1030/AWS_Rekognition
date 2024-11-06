import { useState, useEffect } from "react";
import axios from "axios";

interface Image {
    primary_key: string;
    name: string;
    labels: string[];
    url: string;
}

const ImageGallery = () => {
    const [images, setImages] = useState<Image[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get("http://localhost:3000");
                setImages(response?.data?.results || []);
                console.log(response?.data?.results); // Log the results
            } catch (error) {
                console.log("Error fetching images:", error);
            }
        };
        fetchImages();
    }, []);

    const handleDownload = (url: string, name: string) => {
        // Create an anchor element to simulate a download
        const link = document.createElement("a");
        link.href = url;
        link.download = name; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image) => (
                <div
                    key={image.primary_key}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                    <div className="h-48 overflow-hidden">
                        <img
                            src={image.url} // Use 'image.url' to display the image
                            alt={image.name}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {image.labels.map((label, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-200 rounded-full px-3 py-1 text-sm hover:bg-gray-300 cursor-pointer"
                                    title={label}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={() => handleDownload(image.url, image.name)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
