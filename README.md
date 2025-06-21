# AWS Automated Receipt Billing System

A web-based system for uploading, processing, and managing receipts using AWS services.

## Overview

This system allows users to upload receipts through a web interface. The uploaded receipts are stored in an S3 bucket, which triggers a Lambda function to process the receipts using Amazon Textract. The extracted data is then stored in DynamoDB and a notification email is sent.

## Architecture

1. **Frontend**: HTML, CSS, and JavaScript for user interface
2. **Storage**: Amazon S3 for storing receipt files
3. **Processing**: AWS Lambda function triggered by S3 uploads
4. **Text Extraction**: Amazon Textract for extracting data from receipts
5. **Database**: Amazon DynamoDB for storing processed receipt data
6. **Notifications**: Amazon SES for sending email notifications

## Setup Instructions

### Prerequisites

- AWS Account
- S3 bucket for storing receipts
- Lambda function set up with Textract, DynamoDB, and SES permissions
- DynamoDB table named "Receipts" (or update the environment variable in Lambda)
- SES configured with verified email addresses

### Frontend Setup

1. Clone this repository to your local machine or web server
2. Open `config.js` and update the AWS configuration:
   ```javascript
   const awsConfig = {
       region: 'your-aws-region',
       bucketName: 'your-s3-bucket-name',
       credentials: {
           accessKeyId: 'your-access-key-id',
           secretAccessKey: 'your-secret-access-key'
       }
   };
   ```
   
   **Note**: For production, DO NOT use hardcoded credentials. Instead, use AWS Cognito or another secure authentication method.

3. Deploy the frontend files to your web server or host them on AWS S3 with static website hosting enabled

### Lambda Function

The Lambda function is already set up in `lambda.py`. Make sure it's deployed to AWS Lambda with the following:

1. Trigger: S3 bucket event (ObjectCreated)
2. Environment variables:
   - `DYNAMODB_TABLE`: Name of your DynamoDB table (default: "Receipts")
   - `SES_SENDER_EMAIL`: Email address to send notifications from
   - `SES_RECIPIENT_EMAIL`: Email address to receive notifications

3. Permissions: The Lambda execution role should have permissions for:
   - S3 (GetObject)
   - Textract (AnalyzeExpense)
   - DynamoDB (PutItem)
   - SES (SendEmail)

## Usage

1. Open the web application in a browser
2. Drag and drop receipt files (PDF, JPG, PNG) or click to select files
3. Files will be uploaded to the "incoming/" folder in your S3 bucket, which triggers the Lambda function
4. The Lambda function will:
   - Extract data from the receipt using Textract
   - Store the extracted data in DynamoDB
   - Send an email notification with receipt details

## Security Considerations

- For production use, implement proper authentication and authorization
- Use AWS Cognito or similar service instead of hardcoded credentials
- Consider encrypting sensitive data in transit and at rest
- Implement proper CORS configuration for the S3 bucket
- Use IAM roles with least privilege principle

## Troubleshooting

- Check browser console for JavaScript errors
- Verify AWS credentials and permissions
- Check Lambda function logs in CloudWatch
- Ensure S3 bucket has proper CORS configuration
- Verify that the DynamoDB table exists and has the correct schema
