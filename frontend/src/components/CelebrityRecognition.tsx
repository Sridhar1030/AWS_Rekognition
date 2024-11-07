import React, { useState, ChangeEvent } from "react";
import { AlertCircle, Camera, Smile, User } from "lucide-react";

interface Emotion {
	type: string;
	confidence: number;
}

interface FaceData {
	Confidence: number;
	BoundingBox: {
		width: number;
		height: number;
		left: number;
		top: number;
	};
	Emotions: Emotion[];
}

interface CelebrityResult {
	name: string;
	gender: string;
	url: string;
	confidence: number;
	Face: FaceData;
}

interface ApiResponse {
	message: string;
	results: CelebrityResult[];
}

const CelebrityRecognition: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [results, setResults] = useState<CelebrityResult[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			setPreviewUrl(URL.createObjectURL(file));
			setResults(null);
			setError(null);
		}
	};

	const handleSubmit = async () => {
		if (!selectedImage) {
			setError("Please select an image first");
			return;
		}

		setLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append("image", selectedImage);

		try {
			const response = await fetch("http://localhost:3000/celebrity", {
				method: "POST",
				body: formData,
			});
			const data: ApiResponse = await response.json();
			if (data.message === "Celebrity detected") {
				setResults(data.results);
			} else {
				setError("No celebrity detected in the image");
			}
		} catch (err) {
			setError("Network error. Failed to connect to the server.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 90) return "text-green-600";
		if (confidence >= 70) return "text-blue-600";
		return "text-yellow-600";
	};

	return (
		<div className="max-w-6xl mx-auto p-8">
			<div className="grid grid-cols-1 gap-8">
				{/* Upload Section */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center gap-2 mb-6">
						<Camera className="h-6 w-6 text-gray-600" />
						<h2 className="text-2xl font-bold text-gray-800">
							Celebrity Recognition
						</h2>
					</div>

					<label className="cursor-pointer w-full">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
							<Camera className="mx-auto h-12 w-12 text-gray-400" />
							<div className="mt-2 text-gray-600">
								Click to upload or drag and drop
							</div>
							<input
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleImageChange}
							/>
						</div>
					</label>

					{previewUrl && (
						<div className="flex justify-center mt-4">
							<img
								src={previewUrl}
								alt="Preview"
								className="max-h-96 rounded-lg shadow-md"
							/>
						</div>
					)}

					<button
						onClick={handleSubmit}
						disabled={!selectedImage || loading}
						className={`w-full py-3 px-4 rounded-md font-medium transition-colors
            ${
				!selectedImage || loading
					? "bg-gray-400 cursor-not-allowed"
					: "bg-blue-600 hover:bg-blue-700 text-white"
			}`}
					>
						{loading ? "Processing..." : "Recognize Celebrity"}
					</button>

					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-600 mt-4">
							<AlertCircle className="h-4 w-4" />
							<p>{error}</p>
						</div>
					)}
				</div>

				{/* Results Section */}
				{results && (
					<div className="bg-white rounded-lg shadow-md p-6">
						{results.map((celebrity, index) => (
							<div
								key={index}
								className="grid grid-cols-1 md:grid-cols-2 gap-8"
							>
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<User className="h-6 w-6 text-blue-600" />
										<h3 className="text-xl font-bold text-gray-800">
											{celebrity.name}
										</h3>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<h4 className="font-semibold text-gray-700 mb-2">
											Recognition Details
										</h4>
										<div className="flex justify-between items-center">
											<span className="font-medium text-gray-600">
												Match Confidence
											</span>
											<span
												className={getConfidenceColor(
													celebrity.confidence
												)}
											>
												{celebrity.confidence.toFixed(
													1
												)}
												%
											</span>
										</div>
										<div className="flex justify-between items-center mt-2">
											<span className="font-medium text-gray-600">
												Gender
											</span>
											<span className="text-gray-700">
												{celebrity.gender}
											</span>
										</div>
										<div className="flex justify-between items-center mt-2">
											<span className="font-medium text-gray-600">
												Face Detection Confidence
											</span>
											<span
												className={getConfidenceColor(
													celebrity.Face.Confidence
												)}
											>
												{celebrity.Face.Confidence.toFixed(
													1
												)}
												%
											</span>
										</div>
									</div>

									{/* Emotions Section */}
									{celebrity.Face.Emotions.length > 0 && (
										<div className="bg-gray-50 p-4 rounded-lg">
											<Smile className="h-5 w-5 text-blue-600 mb-2" />
											<h4 className="font-semibold text-gray-700">
												Emotional Analysis
											</h4>
											{celebrity.Face.Emotions.map(
												(emotion, idx) => (
													<div
														key={idx}
														className="flex justify-between items-center mt-2"
													>
														<span className="font-medium text-gray-600">
															{emotion.type}
														</span>
														<span
															className={getConfidenceColor(
																emotion.confidence
															)}
														>
															{emotion.confidence.toFixed(
																1
															)}
															%
														</span>
													</div>
												)
											)}
										</div>
									)}
								</div>
								<div className="space-y-4">
									{celebrity.url && (
										<div className="bg-gray-50 p-4 rounded-lg">
											<h4 className="font-semibold text-gray-700 mb-2">
												Learn More
											</h4>
											<a
												href={`https://${celebrity.url}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												{celebrity.url}
											</a>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CelebrityRecognition;
