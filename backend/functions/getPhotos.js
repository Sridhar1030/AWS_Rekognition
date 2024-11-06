import AWS from "aws-sdk";
import formatPhotoResponse from "../utils/formatPhotoResponse.js";
const dynomoDB = new AWS.DynamoDB.DocumentClient();

export async function getPhotos(event) {
	const results = await dynomoDB
		.scan({
			TableName: process.env.DYNAMODB_TABLE,
			Limit: 10,
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "GetPhots successfull",
			results:formatPhotoResponse(results.Items),
		}),
	};
}
