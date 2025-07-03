const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    originalText: {
        type: String,
        required: true,
        trim: true
    },
    processedText: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        enum: ['tr', 'en'],
        default: 'tr'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    subject: {
        type: String,
        enum: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry', 'other'],
        default: 'other'
    },
    grade: {
        type: String,
        enum: ['5', '6', '7', '8', '9', '10', '11', '12', 'tyt', 'ayt', 'university'],
        default: '9'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'solved', 'failed'],
        default: 'pending'
    },
    processingTime: {
        type: Number, // in milliseconds
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
problemSchema.index({ userId: 1, createdAt: -1 });
problemSchema.index({ status: 1 });
problemSchema.index({ subject: 1 });
problemSchema.index({ grade: 1 });

module.exports = mongoose.model('Problem', problemSchema);
