const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    plan: {
        type: String,
        enum: ['free', 'grade5-8', 'grade9-12', 'tyt-ayt', 'global'],
        default: 'free'
    },
    questionsRemaining: {
        type: Number,
        default: 3, // Free users get 3 questions
        min: 0
    },
    totalQuestionsAsked: {
        type: Number,
        default: 0,
        min: 0
    },
    language: {
        type: String,
        enum: ['tr', 'en'],
        default: 'tr'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    },
    planExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ plan: 1 });
userSchema.index({ createdAt: -1 });

// Virtual field to check if user has premium plan
userSchema.virtual('isPremium').get(function() {
    return this.plan !== 'free' && 
           (!this.planExpiresAt || this.planExpiresAt > new Date());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can ask questions
userSchema.methods.canAskQuestion = function() {
    if (this.isPremium) return true;
    return this.questionsRemaining > 0;
};

// Method to decrement question count
userSchema.methods.decrementQuestionCount = function() {
    if (!this.isPremium && this.questionsRemaining > 0) {
        this.questionsRemaining -= 1;
        this.totalQuestionsAsked += 1;
    } else if (this.isPremium) {
        this.totalQuestionsAsked += 1;
    }
    return this.save();
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
