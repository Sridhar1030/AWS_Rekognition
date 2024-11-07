
```markdown
# AWS Rekognition Image Gallery

This project is an image gallery app built with AWS Rekognition. The app allows users to upload images, and it performs automatic image analysis to recognize objects, scenes, and celebrities in the uploaded photos. Images and metadata are then displayed in a gallery format, showing detected labels, identified celebrities, and options for image download.

## Features

- **Image Upload**: Users can upload images directly through the app.
- **Label Detection**: AWS Rekognition identifies objects and scenes within each image (e.g., "Car," "Sports Car," "Vehicle").
- **Celebrity Recognition**: Recognizes celebrities in uploaded images.
- **Image Gallery**: Displays uploaded images with detected labels, celebrity information, and a download option.
- **Download Functionality**: Users can download images directly from the gallery.

## Tech Stack

- **Frontend**: React with TypeScript and Tailwind CSS for styling
- **Backend**: Node.js with Serverless Framework
- **AWS Services**:
  - **Rekognition**: For image analysis and celebrity recognition
  - **S3**: To store uploaded images
  - **DynamoDB**: To store image metadata and labels

## Prerequisites

- **Node.js** (version 18.x or later)
- **AWS Account** with Rekognition, S3, and DynamoDB permissions
- **Serverless Framework** installed globally
- **Vite** for frontend development

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   # For frontend
   cd frontend
   npm install

   # For backend
   cd ../backend
   npm install
   ```

3. **Configure AWS Credentials**
   Ensure your AWS credentials are configured on your machine to allow the Serverless Framework access to AWS services.

4. **Environment Variables**

   - In the `frontend` directory, create a `.env` file and add:
     ```plaintext
     REACT_APP_BUCKET_NAME=<your-s3-bucket-name>
     ```

   - In the `backend` directory, create a `.env` file and add:
     ```plaintext
     BUCKET_NAME=<your-s3-bucket-name>
     DYNAMODB_TABLE=<your-dynamodb-table-name>
     ```

5. **Deploy the Backend**

   Use Serverless to deploy the backend services:
   ```bash
   cd backend
   serverless deploy
   ```

   This will create the necessary resources on AWS (S3 bucket, DynamoDB table, API Gateway).

6. **Run the Frontend**

   Start the frontend with Vite:
   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Access the App**

   Open your browser and navigate to `http://localhost:3000` to view the image gallery app.

## Usage

- **Upload Images**: Upload images to the gallery through the frontend interface.
- **View Labels**: After processing, each image displays detected labels and recognized celebrities.
- **Download Images**: Click the "Download" button to save images locally.


## AWS Services

- **Rekognition**: Used for both general label detection and celebrity recognition.
- **S3**: Stores uploaded images and serves them in the gallery.
- **DynamoDB**: Stores metadata (labels, names, celebrity details) for each uploaded image.

## Troubleshooting

1. **Missing Labels or Celebrity Info**: Verify that your AWS IAM role has the correct permissions for Rekognition and DynamoDB.
2. **CORS Issues**: Make sure CORS settings on your S3 bucket and API Gateway allow the frontend to make requests.
3. **Environment Variables**: Confirm that `.env` variables are set correctly in both `frontend` and `backend`.

## License

This project is licensed under the MIT License.
```