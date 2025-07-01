const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const { generateFinalPrompt } = require('./math-prompt-template');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Set your API key in environment variables
});

// Rate limiting for AI requests
const aiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        success: false,
        message: 'Too many AI requests. Please try again later.'
    }
});

// Helper function to create AI prompts based on language and grade
function createMathPrompt(text, language, grade) {
    // Use the new enhanced prompt template
    return generateFinalPrompt(text, {
        language: language,
        grade: grade,
        topic: detectMathTopic(text), // Auto-detect math topic
        studentLevel: 'average'
    });
}

// Helper function to detect math topic from text
function detectMathTopic(text) {
    const topicKeywords = {
        geometry: ['çevre', 'alan', 'perimeter', 'area', 'kare', 'square', 'triangle', 'üçgen', 'daire', 'circle'],
        algebra: ['x', 'y', 'denklem', 'equation', 'çöz', 'solve', '='],
        fractions: ['kesir', 'fraction', '/', 'payda', 'pay'],
        percentage: ['%', 'yüzde', 'percent', 'oran', 'ratio']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
            return topic;
        }
    }
    return 'general';
}

// Helper function to validate grade level
function validateGrade(grade) {
    const validGrades = [5, 6, 7, 8, 9, 10, 11, 12];
    return validGrades.includes(parseInt(grade));
}

// Helper function to validate math content
function containsMathContent(text) {
    const mathPatterns = [
        /\d+/,                    // Numbers
        /[+\-*/=]/,              // Basic operators
        /\b(x|y|z|a|b|c)\b/i,    // Variables
        /\b(solve|find|calculate|compute)\b/i, // Math keywords
        /\b(equation|expression|formula)\b/i,  // Math terms
        /[()[\]{}]/,             // Brackets
        /\b(sin|cos|tan|log|ln)\b/i, // Functions
        /√|∫|∑|π|°/              // Math symbols
    ];
    
    return mathPatterns.some(pattern => pattern.test(text));
}

// POST /api/solve - AI-powered math solver
router.post('/api/solve', aiRateLimit, async (req, res) => {
    try {
        const { text, language = 'tr', grade = 8 } = req.body;

        // Input validation
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Math problem text is required'
            });
        }

        if (text.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Math problem text is too short'
            });
        }

        if (text.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Math problem text is too long (max 2000 characters)'
            });
        }

        // Validate language
        if (!['tr', 'en'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Language must be "tr" or "en"'
            });
        }

        // Validate grade
        if (!validateGrade(grade)) {
            return res.status(400).json({
                success: false,
                message: 'Grade must be between 5 and 12'
            });
        }

        // Check if text contains mathematical content
        if (!containsMathContent(text)) {
            return res.status(400).json({
                success: false,
                message: language === 'tr' 
                    ? 'Lütfen geçerli bir matematik problemi girin'
                    : 'Please enter a valid math problem'
            });
        }

        console.log(`Processing math problem for grade ${grade} in ${language}:`, text.substring(0, 100));

        // Create prompt based on language and grade
        const prompt = createMathPrompt(text, language, grade);

        // Call OpenAI API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4", // or "gpt-3.5-turbo" for faster/cheaper responses
                messages: [
                    {
                        role: "system",
                        content: prompt.system
                    },
                    {
                        role: "user", 
                        content: prompt.user
                    }
                ],
                max_tokens: 1500,
                temperature: 0.3, // Lower temperature for more consistent math solutions
                top_p: 0.9,
                frequency_penalty: 0,
                presence_penalty: 0
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Extract the solution from AI response
            const solution = completion.choices[0]?.message?.content;

            if (!solution) {
                throw new Error('No solution received from AI');
            }

            // Parse usage information
            const usage = completion.usage;

            // Success response
            res.status(200).json({
                success: true,
                message: 'Math problem solved successfully',
                data: {
                    originalProblem: text,
                    solution: solution,
                    language: language,
                    grade: parseInt(grade),
                    model: "gpt-4",
                    confidence: "high",
                    processedAt: new Date().toISOString(),
                    metadata: {
                        tokensUsed: usage?.total_tokens || 0,
                        promptTokens: usage?.prompt_tokens || 0,
                        completionTokens: usage?.completion_tokens || 0
                    }
                }
            });

        } catch (aiError) {
            clearTimeout(timeoutId);
            
            if (aiError.name === 'AbortError') {
                return res.status(408).json({
                    success: false,
                    message: 'AI request timed out. Please try again.'
                });
            }

            throw aiError;
        }

    } catch (error) {
        console.error('Math solver error:', error);

        // Handle OpenAI specific errors
        if (error.response?.status === 401) {
            return res.status(500).json({
                success: false,
                message: 'AI service authentication failed'
            });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'AI service rate limit exceeded. Please try again later.'
            });
        }

        if (error.response?.status === 400) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request to AI service'
            });
        }

        // Handle quota exceeded
        if (error.code === 'insufficient_quota') {
            return res.status(503).json({
                success: false,
                message: 'AI service temporarily unavailable'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Failed to solve math problem. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Alternative endpoint using Groq (faster, cheaper alternative)
/*
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post('/api/solve-groq', aiRateLimit, async (req, res) => {
    try {
        const { text, language = 'tr', grade = 8 } = req.body;

        // Same validation as above...

        const prompt = createMathPrompt(text, language, grade);

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: prompt.system },
                { role: "user", content: prompt.user }
            ],
            model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
            max_tokens: 1500,
            temperature: 0.3
        });

        const solution = completion.choices[0]?.message?.content;

        res.status(200).json({
            success: true,
            data: {
                originalProblem: text,
                solution: solution,
                language: language,
                grade: parseInt(grade),
                model: "llama3-70b",
                processedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Groq solver error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to solve math problem'
        });
    }
});
*/

// Health check endpoint
router.get('/api/solve/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Math solver service is running',
        timestamp: new Date().toISOString(),
        supportedLanguages: ['tr', 'en'],
        supportedGrades: [5, 6, 7, 8, 9, 10, 11, 12]
    });
});

// Get solver statistics (optional)
router.get('/api/solve/stats', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            availableModels: ['gpt-4', 'gpt-3.5-turbo'],
            supportedLanguages: ['tr', 'en'],
            supportedGrades: [5, 6, 7, 8, 9, 10, 11, 12],
            features: [
                'Step-by-step solutions',
                'Grade-appropriate explanations',
                'Multi-language support',
                'Math content validation'
            ]
        }
    });
});

module.exports = router;

// Required dependencies (package.json):
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.28.0",
    "express-rate-limit": "^7.1.5"
  }
}

// Alternative AI providers:
// "groq-sdk": "^0.3.1"          // For Groq
// "@anthropic-ai/sdk": "^0.17.1" // For Claude
*/

// Environment variables (.env):
/*
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here (optional)
NODE_ENV=production
*/

// Usage in main app.js:
/*
const express = require('express');
const solverRoutes = require('./solver-api');

const app = express();

app.use(express.json());
app.use('/', solverRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Math solver API running on port ${PORT}`);
});
*/
