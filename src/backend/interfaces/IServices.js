// Service Interfaces
class IUserService {
    async register(userData, language = 'tr') {
        throw new Error('Method not implemented');
    }

    async login(email, password, language = 'tr') {
        throw new Error('Method not implemented');
    }

    async verifyToken(token) {
        throw new Error('Method not implemented');
    }

    async getUserProfile(userId) {
        throw new Error('Method not implemented');
    }

    async updateProfile(userId, updateData) {
        throw new Error('Method not implemented');
    }

    async checkQuestionLimit(userId) {
        throw new Error('Method not implemented');
    }

    async decrementQuestionCount(userId) {
        throw new Error('Method not implemented');
    }
}

class IMathSolverService {
    async solveProblem(problemData, userId, language = 'tr') {
        throw new Error('Method not implemented');
    }

    async extractTextFromImage(imageBuffer) {
        throw new Error('Method not implemented');
    }

    async getProblemHistory(userId, limit = 10) {
        throw new Error('Method not implemented');
    }
}

class IOCRService {
    async extractText(imageBuffer, language = 'eng') {
        throw new Error('Method not implemented');
    }

    async validateImage(imageBuffer) {
        throw new Error('Method not implemented');
    }
}

class IAIService {
    async solveMathProblem(problemText, language = 'tr') {
        throw new Error('Method not implemented');
    }

    async validateMathProblem(problemText) {
        throw new Error('Method not implemented');
    }
}

module.exports = {
    IUserService,
    IMathSolverService,
    IOCRService,
    IAIService
};
