const Tesseract = require('tesseract.js');
const { IOCRService } = require('../interfaces/IServices');

class OCRService extends IOCRService {
    constructor() {
        super();
        this.supportedLanguages = {
            'tr': 'tur',
            'en': 'eng'
        };
    }

    async extractText(imageBuffer, language = 'eng') {
        try {
            const tesseractLang = this.supportedLanguages[language] || language;
            
            const { data: { text } } = await Tesseract.recognize(
                imageBuffer,
                tesseractLang,
                {
                    logger: m => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`OCR Progress: ${m.status} ${Math.round(m.progress * 100)}%`);
                        }
                    }
                }
            );

            return {
                success: true,
                text: text.trim(),
                confidence: this.calculateConfidence(text),
                language: language
            };
        } catch (error) {
            throw new Error(`OCR extraction failed: ${error.message}`);
        }
    }

    async validateImage(imageBuffer) {
        try {
            // Check if buffer is valid
            if (!imageBuffer || imageBuffer.length === 0) {
                return {
                    isValid: false,
                    error: 'Empty or invalid image buffer'
                };
            }

            // Check file size (max 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (imageBuffer.length > maxSize) {
                return {
                    isValid: false,
                    error: 'Image file too large (max 50MB)'
                };
            }

            // Check image format by magic numbers
            const imageFormats = {
                'ffd8ff': 'jpeg',
                '89504e': 'png',
                '474946': 'gif',
                '424d': 'bmp',
                '52494646': 'webp'
            };

            const header = imageBuffer.toString('hex', 0, 4);
            const format = imageFormats[header] || imageFormats[header.substring(0, 6)];

            if (!format) {
                return {
                    isValid: false,
                    error: 'Unsupported image format. Please use JPEG, PNG, GIF, BMP, or WebP'
                };
            }

            return {
                isValid: true,
                format: format,
                size: imageBuffer.length
            };
        } catch (error) {
            return {
                isValid: false,
                error: `Image validation failed: ${error.message}`
            };
        }
    }

    calculateConfidence(text) {
        try {
            // Simple confidence calculation based on text characteristics
            let confidence = 0.5; // Base confidence

            // Check for mathematical symbols and patterns
            const mathPatterns = [
                /[+\-*/=]/g,
                /\d+/g,
                /[x-z]/g, // variables
                /[(){}[\]]/g, // brackets
                /[∫∑∏√]/g, // mathematical symbols
                /[α-ω]/g // Greek letters
            ];

            mathPatterns.forEach(pattern => {
                const matches = text.match(pattern);
                if (matches) {
                    confidence += Math.min(matches.length * 0.05, 0.2);
                }
            });

            // Penalize for too many unrecognized characters
            const unrecognizedChars = text.match(/[^\w\s+\-*/=(){}[\].,;:!?]/g);
            if (unrecognizedChars) {
                confidence -= Math.min(unrecognizedChars.length * 0.02, 0.3);
            }

            // Ensure confidence is between 0 and 1
            return Math.max(0, Math.min(1, confidence));
        } catch (error) {
            return 0.5; // Default confidence
        }
    }

    async extractMathText(imageBuffer, language = 'eng') {
        try {
            const result = await this.extractText(imageBuffer, language);
            
            if (!result.success) {
                throw new Error('OCR extraction failed');
            }

            // Post-process for mathematical content
            const processedText = this.postProcessMathText(result.text);
            
            return {
                ...result,
                text: processedText,
                originalText: result.text
            };
        } catch (error) {
            throw new Error(`Math text extraction failed: ${error.message}`);
        }
    }

    postProcessMathText(text) {
        try {
            let processed = text;

            // Common OCR corrections for mathematical symbols
            const corrections = {
                '×': '*',
                '÷': '/',
                '−': '-',
                '∙': '*',
                '²': '^2',
                '³': '^3',
                '°': ' degrees',
                '∞': 'infinity',
                '≤': '<=',
                '≥': '>=',
                '≠': '!=',
                '±': '+/-'
            };

            // Apply corrections
            Object.entries(corrections).forEach(([symbol, replacement]) => {
                processed = processed.replace(new RegExp(symbol, 'g'), replacement);
            });

            // Clean up whitespace
            processed = processed.replace(/\s+/g, ' ').trim();

            // Remove line breaks within equations
            processed = processed.replace(/\n\s*(?=[+\-*/=])/g, ' ');

            return processed;
        } catch (error) {
            return text; // Return original if processing fails
        }
    }
}

module.exports = OCRService;
