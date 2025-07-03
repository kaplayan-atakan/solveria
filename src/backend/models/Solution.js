const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    steps: [{
        stepNumber: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        formula: {
            type: String,
            trim: true
        },
        explanation: {
            type: String,
            trim: true
        }
    }],
    finalAnswer: {
        type: String,
        required: true,
        trim: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.9
    },
    aiModel: {
        type: String,
        default: 'gpt-4'
    },
    language: {
        type: String,
        enum: ['tr', 'en'],
        default: 'tr'
    },
    timeTaken: {
        type: Number, // in milliseconds
        default: 0
    },
    isCorrect: {
        type: Boolean,
        default: null // null = not verified, true/false = verified
    },
    userFeedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
solutionSchema.index({ problemId: 1 });
solutionSchema.index({ userId: 1, createdAt: -1 });
solutionSchema.index({ confidence: -1 });

module.exports = mongoose.model('Solution', solutionSchema);
