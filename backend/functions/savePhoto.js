import AWS from "aws-sdk";
import parser from "lambda-multipart-parser";
import { v4 as uuidv4 } from "uuid"; // Correct import

const s3 = new AWS.S3({
	region: "us-east-1", // Replace with your S3 bucket's region
});

const rekognition = new AWS.Rekognition({});
const dynomoDB = new AWS.DynamoDB.DocumentClient();

async function uploadToS3(file) {
	// const BucketName = process.env.BUCKET_NAME;
	// console.log("BucketName", BucketName);
	// const savedFile = await s3
	// 	.putObject({
	// 		Bucket: BucketName,
	// 		Key: file.filename,
	// 		Body: file.content,
	// 	})
	// 	.promise();
	const { Labels } = await rekognition
		.detectLabels({
			Image: {
				Bytes: file.content,
			},
		})
		.promise();
	const primary_key = uuidv4(); // Use uuidv4 here
	const labels = Labels.map((label) => label.Name);

	// await dynomoDB
	// 	.put({
	// 		TableName: process.env.DYNAMODB_TABLE,
	// 		Item: {
	// 			primary_key,
	// 			name: file.filename,
	// 			labels,
	// 		},
	// 	})
	// 	.promise();

	return {
		// primary_key,
		// savedFile: `https://${BucketName}.s3.amazonaws.com/${file.filename}`,
		labels,
		fileContent: file.content.toString("base64"), // Convert file content to Base64 for frontend usage


	};
}

export async function savePhoto(event) {
	const { files } = await parser.parse(event);
	const fileData = files.map(uploadToS3);
	const results = await Promise.all(fileData);
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Files uploaded successfully",
			results,
		}),
	};
}

// New helloWorld function
export async function helloWorld(event) {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Hello, World!",
		}),
	};
}
