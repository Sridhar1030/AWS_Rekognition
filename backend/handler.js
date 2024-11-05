import AWS from "aws-sdk";
import parser from "lambda-multipart-parser";

const s3 = new AWS.S3({
  region: 'us-east-1', // Replace with your S3 bucket's region
});

async function uploadToS3(file) {
  const BucketName =  process.env.BUCKET_NAME;
  console.log("BucketName", BucketName);
  const savedFile = await s3.putObject({
    Bucket: BucketName,
    Key: file.filename,
    Body: file.content,
  }).promise();
  return savedFile;
}

export async function savePhoto(event) {
  const { files } = await parser.parse(event);
  files.forEach(uploadToS3);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
      input: await parser.parse(event),
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
