import AWS from "aws-sdk";
import parser from "lambda-multipart-parser";

const rekognition = new AWS.Rekognition({});

const filterData = async (data) => {
	const filtered = data.map((item) => ({
		name: item.Name,
		gender: item.KnownGender ? item.KnownGender.Type : null,
		url: item.Urls ? item.Urls[0] : null,
		confidence: item.MatchConfidence,
		Face: {
			BoundingBox: {
				width: item.Face.BoundingBox.Width,
				height: item.Face.BoundingBox.Height,
				left: item.Face.BoundingBox.Left,
				top: item.Face.BoundingBox.Top,
			},
			Confidence: item.Face.Confidence,
			Emotions: item.Face.Emotions.sort(
				(a, b) => b.Confidence - a.Confidence
			)
				.slice(0, 3)
				.map((emotion) => ({
					type: emotion.Type,
					confidence: emotion.Confidence,
				})),
		},
	}));
	console.log(filtered);
	return filtered;
};

export async function celeb(event) {
	const { files } = await parser.parse(event);
	const fileData = files[0];

	// Convert Content to Buffer if it's not already in Buffer format
	const contentBuffer = Buffer.isBuffer(fileData.content)
		? fileData.content
		: Buffer.from(fileData.content, "binary");

	const { CelebrityFaces } = await rekognition
		.recognizeCelebrities({
			Image: {
				Bytes: contentBuffer,
			},
		})
		.promise();

	const filteredResults = await filterData(CelebrityFaces);

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Celebrity detected",
			results: filteredResults,
		}),
	};
}
