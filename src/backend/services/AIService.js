const { Configuration, OpenAIApi } = require('openai');
const { IAIService } = require('../interfaces/IServices');

class AIService extends IAIService {
    constructor() {
        super();
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        
        if (this.openaiApiKey) {
            const configuration = new Configuration({
                apiKey: this.openaiApiKey,
            });
            this.openai = new OpenAIApi(configuration);
        }

        this.prompts = {
            tr: {
                system: "Sen bir matematik öğretmenisin. Matematik problemlerini adım adım çözen, açık ve anlaşılır açıklamalar yapan bir asistansın. Her adımı detaylı şekilde açıkla ve öğrencinin konuyu anlamasına yardımcı ol.",
                solve: "Aşağıdaki matematik problemini adım adım çöz. Her adımı numaralandır ve açıkla:\n\n{problem}\n\nÇözüm:"
            },
            en: {
                system: "You are a math teacher. You are an assistant who solves math problems step by step and provides clear and understandable explanations. Explain each step in detail and help the student understand the topic.",
                solve: "Solve the following math problem step by step. Number and explain each step:\n\n{problem}\n\nSolution:"
            }
        };
    }

    async solveMathProblem(problemText, language = 'tr') {
        try {
            if (!this.openaiApiKey) {
                // Fallback to basic solution if no API key
                return this.generateBasicSolution(problemText, language);
            }

            const prompt = this.prompts[language] || this.prompts['tr'];
            const userPrompt = prompt.solve.replace('{problem}', problemText);

            const completion = await this.openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: prompt.system
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7,
            });

            const response = completion.data.choices[0].message.content;
            return this.parseSolution(response, language);
        } catch (error) {
            console.error('OpenAI API Error:', error.message);
            // Fallback to basic solution
            return this.generateBasicSolution(problemText, language);
        }
    }

    async validateMathProblem(problemText) {
        try {
            // Basic validation for mathematical content
            const mathPatterns = [
                /\d+/,                      // Numbers
                /[+\-*/=]/,                 // Basic operators
                /[x-z]/i,                   // Variables
                /\b(solve|find|calculate|determine)\b/i, // Action words
                /[(){}[\]]/,                // Brackets
                /\b(equation|problem|expression)\b/i    // Math terms
            ];

            const hasMathContent = mathPatterns.some(pattern => pattern.test(problemText));
            
            if (!hasMathContent) {
                return {
                    isValid: false,
                    reason: 'Text does not appear to contain mathematical content',
                    confidence: 0.2
                };
            }

            // Check minimum length
            if (problemText.trim().length < 5) {
                return {
                    isValid: false,
                    reason: 'Problem text too short',
                    confidence: 0.1
                };
            }

            // Calculate confidence based on mathematical indicators
            let confidence = 0.5;
            mathPatterns.forEach(pattern => {
                if (pattern.test(problemText)) {
                    confidence += 0.1;
                }
            });

            return {
                isValid: true,
                confidence: Math.min(confidence, 1.0),
                detectedPatterns: mathPatterns.filter(pattern => pattern.test(problemText)).length
            };
        } catch (error) {
            return {
                isValid: false,
                reason: `Validation error: ${error.message}`,
                confidence: 0
            };
        }
    }

    parseSolution(response, language) {
        try {
            const lines = response.split('\n').filter(line => line.trim());
            const steps = [];
            let finalAnswer = '';
            let currentStep = null;

            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                
                // Check if line starts with a step number
                const stepMatch = trimmedLine.match(/^(\d+)[\.\)\:]?\s*(.+)/);
                
                if (stepMatch) {
                    // Save previous step if exists
                    if (currentStep) {
                        steps.push(currentStep);
                    }
                    
                    currentStep = {
                        stepNumber: parseInt(stepMatch[1]),
                        description: stepMatch[2],
                        formula: '',
                        explanation: ''
                    };
                } else if (currentStep && trimmedLine) {
                    // Add to current step description
                    currentStep.explanation += (currentStep.explanation ? ' ' : '') + trimmedLine;
                } else if (trimmedLine && !currentStep) {
                    // Might be the final answer or general explanation
                    if (trimmedLine.toLowerCase().includes('answer') || 
                        trimmedLine.toLowerCase().includes('cevap') ||
                        index === lines.length - 1) {
                        finalAnswer = trimmedLine;
                    }
                }
            });

            // Add last step if exists
            if (currentStep) {
                steps.push(currentStep);
            }

            // Extract final answer if not found
            if (!finalAnswer && steps.length > 0) {
                finalAnswer = steps[steps.length - 1].description;
            }

            return {
                success: true,
                steps: steps,
                finalAnswer: finalAnswer || (language === 'tr' ? 'Çözüm tamamlandı' : 'Solution completed'),
                confidence: this.calculateSolutionConfidence(steps, response),
                rawResponse: response
            };
        } catch (error) {
            return {
                success: false,
                error: `Solution parsing failed: ${error.message}`,
                rawResponse: response
            };
        }
    }

    generateBasicSolution(problemText, language = 'tr') {
        const messages = {
            tr: {
                analyzing: "Problem analiz ediliyor...",
                noAPI: "AI servisi şu anda kullanılamıyor",
                basicSolution: "Temel çözüm önerisi",
                contactSupport: "Detaylı çözüm için destek ekibimize ulaşın"
            },
            en: {
                analyzing: "Analyzing problem...",
                noAPI: "AI service is currently unavailable",
                basicSolution: "Basic solution suggestion",
                contactSupport: "Contact our support team for detailed solution"
            }
        };

        const msg = messages[language] || messages['tr'];

        return {
            success: true,
            steps: [
                {
                    stepNumber: 1,
                    description: msg.analyzing,
                    formula: '',
                    explanation: msg.noAPI
                },
                {
                    stepNumber: 2,
                    description: msg.basicSolution,
                    formula: problemText,
                    explanation: msg.contactSupport
                }
            ],
            finalAnswer: msg.contactSupport,
            confidence: 0.3,
            isBasicSolution: true
        };
    }

    calculateSolutionConfidence(steps, response) {
        try {
            let confidence = 0.5;

            // More steps generally indicate better solution
            confidence += Math.min(steps.length * 0.1, 0.3);

            // Check for mathematical formulas or equations
            const hasFormulas = steps.some(step => 
                /[+\-*/=]/.test(step.description) || 
                /\d+/.test(step.description)
            );
            if (hasFormulas) confidence += 0.2;

            // Check response length (longer usually better)
            if (response.length > 200) confidence += 0.1;
            if (response.length > 500) confidence += 0.1;

            return Math.min(confidence, 1.0);
        } catch (error) {
            return 0.5;
        }
    }
}

module.exports = AIService;
