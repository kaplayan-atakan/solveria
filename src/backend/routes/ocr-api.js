const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/temp';
        // Create directory if it doesn't exist
        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and BMP are allowed.'), false);
    }
};

// Configure multer with limits
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1 // Single file only
    },
    fileFilter: fileFilter
});

// POST /api/ocr - OCR text extraction endpoint
router.post('/api/ocr', upload.single('file'), async (req, res) => {
    let filePath = null;

    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided. Please upload an image.'
            });
        }

        filePath = req.file.path;
        console.log(`Processing OCR for file: ${filePath}`);

        // Validate file exists
        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Uploaded file not found or corrupted.'
            });
        }

        // Configure Tesseract for better math recognition
        const ocrOptions = {
            logger: m => console.log(m), // Optional: log OCR progress
            tessedit_char_whitelist: '0123456789+-*/=()[]{}.,ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz√∫∑∏θπφαβγδλμσΩ°',
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
            preserve_interword_spaces: '1'
        };

        // Perform OCR using Tesseract.js
        const { data: { text, confidence } } = await Tesseract.recognize(
            filePath,
            'eng', // Language (English)
            ocrOptions
        );

        // Clean up extracted text
        const cleanedText = text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/[^\w\s\+\-\*\/\=\(\)\[\]\{\}\.\,\√\∫\∑\∏\θ\π\φ\α\β\γ\δ\λ\μ\σ\Ω\°]/g, '') // Keep only relevant characters
            .trim();

        // Validate OCR result
        if (!cleanedText || cleanedText.length < 2) {
            return res.status(422).json({
                success: false,
                message: 'No readable text found in the image. Please ensure the image is clear and contains mathematical text.',
                extractedText: cleanedText,
                confidence: Math.round(confidence)
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Text extracted successfully',
            data: {
                extractedText: cleanedText,
                confidence: Math.round(confidence),
                originalFileName: req.file.originalname,
                fileSize: req.file.size,
                processedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('OCR processing error:', error);

        // Handle specific OCR errors
        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('File too large')) {
            return res.status(413).json({
                success: false,
                message: 'File size too large. Maximum size is 10MB.'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: 'OCR processing failed. Please try again with a clearer image.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });

    } finally {
        // Clean up: Delete temporary file
        if (filePath) {
            try {
                await fs.unlink(filePath);
                console.log(`Temporary file deleted: ${filePath}`);
            } catch (cleanupError) {
                console.error('Error deleting temporary file:', cleanupError);
            }
        }
    }
});

// Alternative endpoint using Google Vision API (uncomment to use)
/*
const vision = require('@google-cloud/vision');

router.post('/api/ocr-google', upload.single('file'), async (req, res) => {
    let filePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        filePath = req.file.path;

        // Initialize Google Vision client
        const client = new vision.ImageAnnotatorClient();

        // Perform text detection
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;

        if (!detections || detections.length === 0) {
            return res.status(422).json({
                success: false,
                message: 'No text found in the image'
            });
        }

        const extractedText = detections[0].description.trim();

        res.status(200).json({
            success: true,
            message: 'Text extracted successfully using Google Vision',
            data: {
                extractedText: extractedText,
                confidence: 95, // Google Vision typically has high confidence
                originalFileName: req.file.originalname,
                processedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Google Vision OCR error:', error);
        res.status(500).json({
            success: false,
            message: 'OCR processing failed'
        });
    } finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        }
    }
});
*/

// Health check endpoint
router.get('/api/ocr/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'OCR service is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

// Required dependencies (package.json):
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "tesseract.js": "^4.1.1",
    "uuid": "^9.0.0"
  }
}

// For Google Vision API (optional):
// "@google-cloud/vision": "^3.1.4"
*/

// Usage in main app.js:
/*
const express = require('express');
const ocrRoutes = require('./ocr-api');

const app = express();

app.use(express.json());
app.use('/', ocrRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OCR API server running on port ${PORT}`);
});
*/
