const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors());

// Configure multer for file uploads with size limit
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure 'uploads/' exists or create it
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Endpoint to handle file upload
app.post('/images/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server error');
});

// Example endpoint to serve files
app.get('/images/1', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'some-image.jpg');
    res.sendFile(filePath);
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
