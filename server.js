// server.js
// Express backend for uploading PDF receipts to S3
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS if needed
app.use(cors());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS S3 setup
AWS.config.update({ region: 'us-east-1' }); // Change region if needed
const s3 = new AWS.S3();
const BUCKET_NAME = 'receiptproject-rahul';

app.post('/upload', upload.single('receipt'), async (req, res) => {
    try {
        if (!req.file || req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, error: 'Invalid file type. Only PDF allowed.' });
        }
        const fileName = Date.now() + '-' + path.basename(req.file.originalname);
        const s3Key = `incoming/${fileName}`;
        const params = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: req.file.buffer,
            ContentType: 'application/pdf',
        };
        await s3.upload(params).promise();
        res.json({ success: true, key: s3Key });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// To run:
// 1. npm install express multer aws-sdk cors
// 2. Set AWS credentials in your environment (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// 3. node server.js
